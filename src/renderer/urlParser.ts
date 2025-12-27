const protocolPart = '^(?<protocol>https?:(?<protoslash>\/{0,2}))?';
const subdomainPart =
	'(?<subdomain>(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)\\.)?';
const domainPart =
	'(?<domain>(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?))';
const topLevelDomainPart = '(?<tld>\\.(?:[a-zA-Z]{0,63}))?';
const portPart = '(?<port>:(?:\\d+))?';
const urlpattern = new RegExp(
	protocolPart + subdomainPart + domainPart + topLevelDomainPart + portPart,
);

export function parseInput(textInput: string) {
	const matchURL = textInput.match(urlpattern);

	if (!matchURL) {
		return `https://www.google.com/search?q=${encodeURIComponent(textInput)}`;
	}

	const { protocol, port, protoslash, tld, subdomain } =
		matchURL.groups || {};

	if (protocol) {
		if (protoslash) {
			return textInput.replace(protoslash, '//');
		}
		return textInput.replace(protocol, protocol + '//');
	}

	if (tld || subdomain) {
		return `https://${textInput}`;
	}
	if (port) {
		return `http://${textInput}`;
	}

	return `https://www.google.com/search?q=${encodeURIComponent(textInput)}`;
}
