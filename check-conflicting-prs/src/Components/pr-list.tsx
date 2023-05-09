import { List } from "@raycast/api";

export function PRList(data: Array<string>) {
    return (
        <List isShowingDetail>
            {data.map((item) => (
                <List.Item
                    title={"PR title: " + item}
                    key={item}
                    detail={
                        <List.Item.Detail
                            metadata={
                                <List.Item.Detail.Metadata>
                                    <List.Item.Detail.Metadata.Label title="Basic Information" />
                                    <List.Item.Detail.Metadata.Label title="Title" text="Revert specific changes" />
                                    <List.Item.Detail.Metadata.Label title="Created" text="1/1/23" />
                                    <List.Item.Detail.Metadata.Label title="Last Updated" text="1/2/23" />
                                    <List.Item.Detail.Metadata.Separator />
                                    <List.Item.Detail.Metadata.Label title="Checks" />
                                    <List.Item.Detail.Metadata.Label title="Conflicts" text="True" />
                                    <List.Item.Detail.Metadata.Link title="URL" text="Link" target="https://www.google.com" />
                                    <List.Item.Detail.Metadata.Separator />
                                </List.Item.Detail.Metadata>
                            }
                        />
                    }
                />
            ))}
        </List>
    );
}