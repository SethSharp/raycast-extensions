import { List, ActionPanel, Action, Detail } from "@raycast/api";

export function PRList(data: [any]) {

    function convertDate(date: Date) {
        return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
    }

    function getReviewer(item: any) {
        let str = ''
        item.node.reviewRequests.edges.map((review: any) => {
            str += review.node.requestedReviewer.login + ', '
        })
        str = str.slice(0, -2)
        return str;
    }

    return (
        <List isShowingDetail>
            {data.map((item) => (
                <List.Item
                    title={item.node.title}
                    key={item.node.title}
                    detail={
                        <List.Item.Detail
                            metadata={
                                <List.Item.Detail.Metadata>
                                    <List.Item.Detail.Metadata.Label title="Basic Information" />
                                    <List.Item.Detail.Metadata.Label title="Title" text={item.node.title} />
                                    <List.Item.Detail.Metadata.Label title="State" text={item.node.state} icon={item.node.state === "OPEN" ? "🟢" : item.node.state == "CLOSED" ? "🔴" : "🟣"} />
                                    <List.Item.Detail.Metadata.Label title="Created" text={convertDate(new Date(item.node.createdAt))} />
                                    <List.Item.Detail.Metadata.Label title="Last Updated" text={convertDate(new Date(item.node.updatedAt))} />
                                    <List.Item.Detail.Metadata.Separator />
                                    <List.Item.Detail.Metadata.Label title="Checks"/>
                                    <List.Item.Detail.Metadata.Label title="Conflicts" text={item.node.mergeable === "CONFLICTING" ? 'Conflicts with merging' : 'No Conflicts'}/>
                                    <List.Item.Detail.Metadata.Link title="URL" text="Link" target={item.node.url} />
                                    <List.Item.Detail.Metadata.Separator />
                                    <List.Item.Detail.Metadata.Label title="Reviewer" text={getReviewer(item)} />
                                    <List.Item.Detail.Metadata.Separator />
                                </List.Item.Detail.Metadata>
                            }
                        />
                    }
                    actions={
                        <ActionPanel title="Actions to perform">
                            <Action.OpenInBrowser url={item.node.url} />
                            <Action.CopyToClipboard title="Copy Pull Request Title" content={item.node.title} />
                        </ActionPanel>
                    }
                />
            ))}
        </List>
    );
}