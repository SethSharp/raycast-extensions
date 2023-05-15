import { List } from "@raycast/api";

export function PRList(data: [any]) {

    function convertDate(date: string) {

        const dateObj = new Date(date);

        return `${dateObj.getDate()}/${dateObj.getMonth()+1}/${dateObj.getFullYear()}`;
    }

    return (
        <List isShowingDetail>
            {data.map((item) => (
                <List.Item
                    title={item.node.title.substring(item.node.title.indexOf('/') + 1)}
                    key={item.node.number}
                    detail={
                        <List.Item.Detail
                            metadata={
                                <List.Item.Detail.Metadata>
                                    <List.Item.Detail.Metadata.Label title="Basic Information" />
                                    <List.Item.Detail.Metadata.Label title="Title" text={item.node.title} />
                                    <List.Item.Detail.Metadata.Label title="State" text={item.node.state} />
                                    <List.Item.Detail.Metadata.Label title="Created" text={convertDate(item.node.createdAt)} />
                                    <List.Item.Detail.Metadata.Label title="Last Updated" text={convertDate(item.node.updatedAt)} />
                                    <List.Item.Detail.Metadata.Separator />
                                    <List.Item.Detail.Metadata.Label title="Checks"/>
                                    <List.Item.Detail.Metadata.Label title="Conflicts" text={item.node.mergeable == 'CONFLICTS' ? 'Changes required' : item.node.mergeable == 'UNKOWN' ? 'other issue' : 'All g'}/>
                                    <List.Item.Detail.Metadata.Link title="URL" text="Link" target={item.node.url} />
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