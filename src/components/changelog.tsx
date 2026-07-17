import * as obj from "../utilities/obj";
import type { JSX } from "react/jsx-runtime";

function ChangelogUnit({date, changelog}: {date: string, changelog: obj.ChangelogInfo}) {
    const additionClassical: string = changelog.addition.classic.join(", ");
    const additionPlatformer: string = changelog.addition.platformer.join(", ");
    const deletionClassical: string = changelog.deletion.classic.join(", ");
    const deletionPlatformer: string = changelog.deletion.platformer.join(", ");

    const addition: string = (additionClassical + additionPlatformer != "") ? `新增 ${additionClassical}, ${additionPlatformer}` : "";
    const deletion: string = (deletionClassical + deletionPlatformer != "") ? `移除 ${deletionClassical}, ${deletionPlatformer}` : "";

    const listChange: string = [addition, deletion].join("，");

    return (
        <>
            <div>
                {date} - {listChange}
            </div>
        </>
    );
}

export function Changelog({changelog_list}: {changelog_list: obj.Changelogs}) {
    let rows: JSX.Element[] = [];
    changelog_list.forEach((changelog, date) => {
        rows.push(
            <ChangelogUnit key={date} date={date} changelog={changelog} />
        );
    });
    return rows;
}