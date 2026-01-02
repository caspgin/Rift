//Adblocking engine

import { app, session } from 'electron';
import fs from 'node:fs';
import readline from 'node:readline';
import path from 'node:path';

export function shouldBlock(url: string, blockedSet: Set<string>): boolean {
	try {
		const host = new URL(url).hostname;
		if (blockedSet.has(host)) return true;
		return false;
	} catch {
		return false;
	}
}

export function initAdBlocking(): void {
	const hashSet: Set<string> = new Set<string>();
	const hostPath: string = getHostPath();
	buildSet(hostPath, hashSet);
	const filter = { urls: ['http://*/*', 'https://*/*'] };

	session.defaultSession.webRequest.onBeforeRequest(
		filter,
		(details, callback) => {
			if (shouldBlock(details.url, hashSet)) {
				callback({ cancel: true });
			} else {
				console.log(`Not Blocked : ${details.url}`);
				callback({ cancel: false });
			}
		},
	);
}

export function buildSet(hostPath: string, hashSet: Set<string>): void {
	const stream: fs.ReadStream = fs.createReadStream(hostPath);
	const rl: readline.Interface = readline.createInterface({ input: stream });
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
		console.log(`Read ${hashSet.size} domains for exact blocking in set`);
	});
}

export function getHostPath(): string {
	return path.join(app.getAppPath(), 'dist', 'assets', 'hosts.txt');
}
