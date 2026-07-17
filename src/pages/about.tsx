import { Changelog } from "../components/changelog";
import * as obj from "../utilities/obj";

export function About({changelogs}: {changelogs: obj.Changelogs}) {
    return (
        <>
            <div>
                <h2>Welcome to My Site</h2>
            </div>
            <div>
                <Changelog changelog_list={changelogs} />
            </div>
        </>
    );
}