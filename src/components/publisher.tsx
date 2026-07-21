import { useState, useEffect } from "react";
import { fetchPublisher } from "../utilities/fetch";

const publisherCache = new Map<string, string>();

interface PublisherProps {
    publisher?: string;
    publisherId?: string;
}

export function Publisher({ publisher, publisherId }: PublisherProps) {
    const initialName = publisher
        || (publisherId ? publisherCache.get(publisherId) : undefined)
        || "-";

    const [name, setName] = useState<string>(initialName);

    useEffect(() => {
        if (publisher) {
            setName(publisher);
            return;
        }

        if (!publisherId) {
            setName("-");
            return;
        }

        if (publisherCache.has(publisherId)) {
            setName(publisherCache.get(publisherId)!);
            return;
        }

        let isMounted = true;
        setName("-");
        fetchPublisher(publisherId).then((fetchedName) => {
            publisherCache.set(publisherId, fetchedName); // Cache it
            if (isMounted) {
                setName(fetchedName);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [publisher, publisherId]);

    return <span>{name}</span>;
}