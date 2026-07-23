import * as obj from "../utilities/obj";
import type { JSX } from "react/jsx-runtime";

function joinElements(elements: JSX.Element[], sep: string = ", ") {
    if (elements.length === 0) return null;
    let prepareElements = elements.slice(0, elements.length - 1).map((element) => <>{element}{sep}</>);
    prepareElements.push(elements[elements.length - 1]);
    return <>{prepareElements}</>;
}

function ChangelogUnit({date, changelog}: {date: string, changelog: obj.ChangelogInfo}) {
    let additionClassic = changelog.addition.classic.map(x => <span>{x}</span>);
    let additionPlatformer = changelog.addition.platformer.map(x => <span>{x}</span>);
    let deletionClassic = changelog.deletion.classic.map(x => <span>{x}</span>);
    let deletionPlatformer = changelog.deletion.platformer.map(x => <span>{x}</span>);

    let addition = joinElements([...additionClassic, ...additionPlatformer]);
    let deletion = joinElements([...deletionClassic, ...deletionPlatformer]);
    if (addition != null) addition = <>新增{addition}</>;
    if (deletion != null) deletion = <>移除{deletion}</>;

    let listChange = <></>;
    if (addition != null && deletion != null)
        listChange = <>{date} - {addition}，{deletion}</>;
    else if (addition != null)
        listChange = <>{date} - {addition}</>;
    else if (deletion != null)
        listChange = <>{date} - {deletion}</>;

    let update = (changelog.update != undefined) ? <>{date} - ({changelog.update.version}) {changelog.update.message}</> : <></>;

    return (
        <>
            <div>{listChange}</div>
            <div>{update}</div>
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