import {Detail} from "@raycast/api";
import {PRList} from "./Components/pr-list";

const items = ["Item #1", "Item #2", "Item #3"];

export default function Command() {
    return PRList(items);
}