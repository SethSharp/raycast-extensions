import { PRList } from "./Components/pr-list";
import { ActionPanel, Form, Action, Cache, showToast, Toast } from "@raycast/api";
import {useState} from "react";
import axios from "axios";

let items:any;

interface MyForm {
    author: string,
    organisation: string,
    token: string,
}

export default function Command() {

    const myForm: MyForm = {
        author: '',
        organisation: '',
        token: ''
    }

    const [authorError, setAuthorError] = useState<string | undefined>();
    const [organisationError, setOrganisationError] = useState<string | undefined>();
    const [tokenError, setTokenError] = useState<string | undefined>();
    const [submitted, setSubmitted] = useState(false);

    async function makeGraphQlRequest(form: MyForm) {

        const query = `{
                      search(query: "is:open is:pr author:${form.author} org:${form.organisation}", type: ISSUE, first: 100) {
                        issueCount
                        edges {
                          node {
                            ... on PullRequest {
                              number
                              title
                              url
                              mergeable
                              state
                              createdAt
                              updatedAt
                            }
                          }
                        }
                      }
                    }`;

        return await axios.post(
            'https://api.github.com/graphql',
            { query },
            {
                headers: {
                    Authorization: `Bearer ${form.token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    function dropAuthorErrorIfNeeded() {
        if (authorError && authorError.length > 0) {
            setAuthorError(undefined);
        }
    }

    function dropOrganisationErrorIfNeeded() {
        if (organisationError && organisationError.length > 0) {
            setOrganisationError(undefined);
        }
    }

    function dropTokenErrorIfNeeded() {
        if (tokenError && tokenError.length > 0) {
            setTokenError(undefined);
        }
    }

    function cacheForm(form: MyForm) {
        new Cache().set("form", JSON.stringify([{ author: form.author, organisation: form.organisation, token: form.token }]));
    }

    function checkFormCache() {
        const cached = new Cache().get("form");
        if (cached) {
            const data = JSON.parse(cached)[0];
            myForm.author = data.author
            myForm.organisation = data.organisation
            myForm.token = data.token
        }
    }

    function submitForm(form: MyForm) {

        if (form.author == '') {
            setAuthorError('Name is required');
            return;
        }

        if (form.organisation == '') {
            setOrganisationError('Organisation is required');
            return;
        }

        if (form.token == '') {
            setTokenError('Token is required');
            return;
        }

        makeGraphQlRequest(form).then(res => {
            if (res) {
                items = res.data.data.search.edges;
                setSubmitted(true);
                cacheForm(form);
            }
        }).catch(_ => {
            showToast({
                style: Toast.Style.Failure,
                title: "Failure with GitHub Request -> Check your details before submitting again",
            });
        });
    }

    if (submitted) {
        return PRList(items);
    }

    // OnMounted/render
    checkFormCache()

    return (
        <Form
            actions={
                <ActionPanel>
                    <Action.SubmitForm title="Submit Answer" onSubmit={submitForm} />
                </ActionPanel>
            }
        >
            <Form.TextField
                id="author"
                placeholder='GitHub Username'
                defaultValue={myForm.author}
                error={authorError}
                onChange={dropAuthorErrorIfNeeded}
            />
            <Form.TextField
                id="organisation"
                placeholder="Organisation name"
                defaultValue={myForm.organisation}
                error={organisationError}
                onChange={dropOrganisationErrorIfNeeded}
            />
            <Form.TextField
                id="token"
                placeholder="GitHub API token"
                defaultValue={myForm.token}
                error={tokenError}
                onChange={dropTokenErrorIfNeeded}
            />
            <Form.Description
                title="Creating your GitHub Token"
                text="Generate a token in GitHub with the repo scope option selected, name being one you will remember and a expiration date you are comfortable with"
            />
        </Form>
    );
}