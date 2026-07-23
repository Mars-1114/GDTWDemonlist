import * as obj from "../utilities/obj";
import {ContactLink} from "./image_link.tsx";

import LeftGroup from "../assets/img/leave.png";

interface PlayerInfoProps {
    name: string;
    info: obj.RawPlayerInfo;
}

export function PlayerInfo({name, info}: PlayerInfoProps) {
    let youtubeUrl = "https://www.youtube.com/@" + info.contact.youtube;
    let facebookUrl = "https://www.facebook.com/groups/173396940046034/user/" + info.contact.facebook;
    let gdUrl = "https://gdbrowser.com/u/" + info.contact.gd;

    let leftGroup = info.in_group ? null : <img alt="left_group" title="此玩家已退社" width="50px" src={LeftGroup} />;
    let youtubeLink = (info.contact.youtube != undefined) ? <ContactLink key="yt" url={youtubeUrl} /> : null;
    let facebookLink = (info.contact.facebook != undefined) ? <ContactLink key="fb" url={facebookUrl} /> : null;
    let gdLink = (info.contact.gd != undefined) ? <ContactLink key="gd" url={gdUrl} /> : null;

    return <div>
        <h2>{name} {leftGroup}</h2>
        <span>
            {youtubeLink}
            {facebookLink}
            {gdLink}
        </span>
    </div>;
}