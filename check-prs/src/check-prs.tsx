import { PRList } from "./Components/pr-list";
import { ActionPanel, Form, Action, Cache, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import axios from "axios";

let items:any;

interface MyForm {
    author: string,
    organisation: string,
    token: string,
    state: string,
    conflicts: string,
    reviewer: string,
    count: number,
}

export default function Command() {

    const myForm: MyForm = {
        author: '',
        organisation: '',
        token: '',
        state: 'is:open',
        conflicts: '0',
        reviewer: '',
        count: 0,
    }

    const [authorError, setAuthorError] = useState<string | undefined>();
    const [organisationError, setOrganisationError] = useState<string | undefined>();
    const [tokenError, setTokenError] = useState<string | undefined>();
    const [countError, setCountError] = useState<string | undefined>();

    const [submitted, setSubmitted] = useState(false);

    async function makeGraphQlRequest(form: MyForm) {

        const query =
            `{
              search(
                query: "${form.state} is:pr author:${form.author} org:${form.organisation}", 
                type: ISSUE, 
                first: ${form.count}
              ) {
                issueCount
                edges {
                  node {
                    ... on PullRequest {
                      reviewRequests(first: 10) {
                        edges {
                          node {
                            requestedReviewer {
                              ... on User {
                                login
                              }
                            }
                          }
                        }
                      }
                      reviews(first: 5) {
                        edges {
                          node {
                            author {
                              login
                            }
                            state
                          }
                        }
                      }
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

    function dropCountErrorIfNeeded() {
        if (countError && countError.length > 0 ) {
            setCountError(undefined);
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
        new Cache().set("form", JSON.stringify([{ author: form.author, organisation: form.organisation, token: form.token, reviewer: form.reviewer }]));
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

        if (isNaN(form.count)) {
            setCountError('Count must be a number');
            return;
        }

        makeGraphQlRequest(form).then(res => {
            if (res) {
                items = res.data.data.search.edges;

                if (form.conflicts == '1') {
                    items = items.filter(
                        (pr: any) => pr.node.mergeable === 'MERGEABLE'
                    );
                } else if (form.conflicts == '2') {
                    items = items.filter(
                        (pr: any) => pr.node.mergeable === 'CONFLICTING'
                    );
                }

                if (form.reviewer) {
                    items = items.filter((item: any) => {
                        return item.node.reviewRequests.edges.some((r: any) => r.node.requestedReviewer.login === form.reviewer);
                    });
                }

                setSubmitted(true);
                cacheForm(form);
            }
        }).catch(err => {
            showToast({
                style: Toast.Style.Failure,
                title: "Failure with GitHub Request -> Check your details before submitting again",
                message: err
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
                    <Action.SubmitForm title="Submit Answer" onSubmit={(values: MyForm) => submitForm(values)} />
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
            <Form.Dropdown
                id="state"
                title="Choose State of PR"
                defaultValue={myForm.state}
            >
                <Form.DropdownItem value="" title="All PRs" icon="⚪️"/>
                <Form.DropdownItem value="is:open" title="Open PRs" icon="🟢"/>
                <Form.DropdownItem value="is:merged" title="Merged PRs" icon="🟣"/>
                <Form.DropdownItem value="is:closed" title="Closed PRs" icon="🔴"/>
            </Form.Dropdown>
            <Form.Dropdown
                id="conflicts"
                title="Has conflicts"
                defaultValue={myForm.conflicts}
            >
                <Form.DropdownItem value="0" title="All PRs" icon="⚪️"/>
                <Form.DropdownItem value="1" title="Non Conflicting" icon="🟢"/>
                <Form.DropdownItem value="2" title="Conflicting" icon="🔴"/>
            </Form.Dropdown>
            <Form.TextField
                id="reviewer"
                placeholder="Select a reviewer"
                defaultValue={myForm.reviewer}
            />
            <Form.TextField
                id="count"
                title="Number of Results"
                error={countError}
                defaultValue="10"
                onChange={dropCountErrorIfNeeded}
            />
        </Form>
    );
}