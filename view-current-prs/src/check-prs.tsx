import dotenv from 'dotenv';
dotenv.config();
import {PRList} from "./Components/pr-list";
import { ActionPanel, Form, Action } from "@raycast/api";
import {useState} from "react";
import axios from "axios";

let items:any;

interface MyForm {
    author: string,
    organisation: string,
    token: string,
}

export default function Command() {
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
                    }
                    `;

        return axios.post(
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

    function submitForm(form: MyForm) {
        // make request
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

        // if doesn't fail
        makeGraphQlRequest(form).then(res => {
            items = res.data.data.search.edges;
            setSubmitted(true);
        })
    }

    if (submitted) {
        return PRList(items);
    }

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
                defaultValue="SethSharp"
                error={authorError}
                onChange={dropAuthorErrorIfNeeded}
            />
            <Form.TextField
                id="organisation"
                defaultValue="codinglabsau"
                error={organisationError}
                onChange={dropOrganisationErrorIfNeeded}
            />
            <Form.TextField
                id="token"
                defaultValue="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"
                error={tokenError}
                onChange={dropTokenErrorIfNeeded}
            />
        </Form>
    );
}