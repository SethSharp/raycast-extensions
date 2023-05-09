import {Detail} from "@raycast/api";
import {PRList} from "./Components/pr-list";
import { ActionPanel, Form, Action } from "@raycast/api";
import {useState} from "react";

const items = ["Item #1", "Item #2", "Item #3"];

type MyForm = {
    author: string,
    organisation: string,
    token: string,
}

export default function Command() {

    const [authorError, setAuthorError] = useState<string | undefined>();
    const [organisationError, setOrganisationError] = useState<string | undefined>();
    const [tokenError, setTokenError] = useState<string | undefined>();

    const [submitted, setSubmitted] = useState(false);

    function submitForm(form: MyForm) {
        // make request
        console.log(form.author);
        if (form.author == undefined) {
            setAuthorError('Name is required');
            return;
        }

        if (form.organisation == undefined) {
            setOrganisationError('Organisation is required');
            return;
        }

        if (form.token == undefined) {
            setTokenError('Token is required');
            return;
        }

        // if doesn't fail
        setSubmitted(true);
    }

    if (submitted) {
        return PRList(items);
    }

    return (
        <Form
            actions={
                <ActionPanel>
                    <Action.SubmitForm title="Submit Answer" onSubmit={(values) => submitForm(values)} />
                </ActionPanel>
            }
        >
            <Form.TextField id="author" placeholder="James" error={authorError}/>
            <Form.TextField id="organisation" placeholder="codinglabsau" defaultValue="codinglabsau" error={organisationError}/>
            <Form.TextField id="token" placeholder="secret..." error={tokenError}/>
        </Form>
    );
}