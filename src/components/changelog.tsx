import * as obj from "../utilities/obj";
import type { JSX } from "react/jsx-runtime";

interface ChangelogProps {
    changelogList: obj.Changelogs;
}

interface ChangelogUnitProps {
    date: string;
    changelog: obj.ChangelogInfo;
}

function joinElements(elements: JSX.Element[], sep: string = ", ") {
    if (elements.length === 0) return null;
    let prepareElements = elements.slice(0, elements.length - 1).map((element) => <>{element}{sep}</>);
    prepareElements.push(elements[elements.length - 1]);
    return <>{prepareElements}</>;
}

function ChangelogUnit({date, changelog}: ChangelogUnitProps) {
    let addition = changelog.addition;
    let deletion = changelog.deletion;
    let additionClassic = (addition && addition.classic) ? addition.classic.map(x => <span>{x}</span>) : [];
    let additionPlatformer = (addition && addition.platformer) ? addition.platformer.map(x => <span>{x}</span>) : [];
    let deletionClassic = (deletion && deletion.classic) ? deletion.classic.map(x => <span>{x}</span>) : [];
    let deletionPlatformer = (deletion && deletion.platformer) ? deletion.platformer.map(x => <span>{x}</span>) : [];

    let formattedAddition = joinElements([...additionClassic, ...additionPlatformer]);
    let formattedDeletion = joinElements([...deletionClassic, ...deletionPlatformer]);
    if (formattedAddition != null) formattedAddition = <>新增{formattedAddition}</>;
    if (formattedDeletion != null) formattedDeletion = <>移除{formattedDeletion}</>;

    let listChange = <></>;
    if (formattedAddition != null && formattedDeletion != null)
        listChange = <>{date} - {formattedAddition}，{formattedDeletion}</>;
    else if (formattedAddition != null)
        listChange = <>{date} - {formattedAddition}</>;
    else if (formattedDeletion != null)
        listChange = <>{date} - {formattedDeletion}</>;

    let update = (changelog.update != undefined) ? <>{date} - ({changelog.update.version}) {changelog.update.message}</> : <></>;

    return (
        <>
            <div>{listChange}</div>
            <div>{update}</div>
        </>
    );
}

export function Changelog({changelogList}: ChangelogProps) {
    let rows: JSX.Element[] = [];
    changelogList.forEach((changelog, date) => {
        rows.push(
            <ChangelogUnit key={date} date={date} changelog={changelog} />
        );
    });
    return rows;
}