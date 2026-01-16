//Adblocking engine

import { app, session } from 'electron';
import fs from 'node:fs';
import readline from 'node:readline';
import path from 'node:path';

export function shouldBlock(url: string, blockedSet: Set<string>): boolean {
	try {
		const host = new URL(url).hostname;

		if (blockedSet.has(host)) return true;
		for (const domain of blockedSet) {
			if (host.endsWith('.' + domain)) return true;
		}

		return false;
	} catch {
		return false;
	}
}

export async function initAdBlocking(): Promise<void> {
	const hashSet: Set<string> = new Set<string>();
	const hostPath: string = getHostPath();
	await buildSet(hostPath, hashSet);
	const filter = { urls: ['http://*/*', 'https://*/*'] };

	session.defaultSession.webRequest.onBeforeRequest(
		filter,
		(details, callback) => {
			if (shouldBlock(details.url, hashSet)) {
				callback({ cancel: true });
			} else {
				callback({ cancel: false });
			}
		},
	);
}

export function buildSet(
	hostPath: string,
	hashSet: Set<string>,
): Promise<Set<string>> {
	return new Promise((resolve, reject) => {
		const stream: fs.ReadStream = fs.createReadStream(hostPath);

		stream.on('error', (error: Error) => reject(error));
		const rl: readline.Interface = readline.createInterface({
			input: stream,
		});

		rl.on('line', (line: string) => {
			if (!line.startsWith('0.0.0.0')) {
				return;
			}
			const domain: string = line.split(' ', 2)[1].trim();
			if (!domain) {
				return;
			}
			hashSet.add(domain);
		});
		rl.on('close', () => {
			console.log(
				`Read ${hashSet.size} domains for exact blocking in set`,
			);
			resolve(hashSet);
		});
	});
}

export function getHostPath(): string {
	return path.join(app.getAppPath(), 'dist', 'assets', 'hosts.txt');
}
