import { Changelog } from "../components/changelog";
import * as obj from "../utilities/obj";

interface AboutProps {
    changelogs: obj.Changelogs;
}

export function About({changelogs}: AboutProps) {
    return (
        <>
            <div>
                <h2>Welcome to My Site</h2>
            </div>
            <div>
                <Changelog changelogList={changelogs} />
            </div>
        </>
    );
}