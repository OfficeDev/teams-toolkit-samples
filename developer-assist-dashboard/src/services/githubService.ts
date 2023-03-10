import { githubIssuesModel } from "../models/githubIssuesModel";
import { Octokit } from "octokit";
import * as configs from "../configs";

export async function getIssues(): Promise<githubIssuesModel[]> {

    const octokit = new Octokit({
        //github personal access token
        auth: configs.GITHUB_PERSONAL_ACCESS_TOKEN

    })

    try {
        const resp = await octokit.request('GET /repos/{owner}/{repo}/issues', {
            //repository name and owner name
            owner: configs.REPOSITORY_OWNER_NAME,
            repo: configs.REPOSITORY_NAME
        })

        let issues: githubIssuesModel[] = [];
        for (const obj of resp.data) {
            const tmp: githubIssuesModel = {
                state: obj["state"],
                url: obj["html_url"],
                title: obj["title"],
                body: obj["body"]
            };
            issues.push(tmp);
        }
        return issues;
    } catch (e) {
        throw e;
    }
}

export async function createIssue(title: string): Promise<githubIssuesModel[]> {
    const octokit = new Octokit({
        //github personal access token
        auth: configs.GITHUB_PERSONAL_ACCESS_TOKEN

    })

    try {

        await octokit.request('POST /repos/{owner}/{repo}/issues', {
            //repository name and owner name
            owner: configs.REPOSITORY_OWNER_NAME,
            repo: configs.REPOSITORY_NAME,
            title: title
        })

        const resp = await octokit.request('GET /repos/{owner}/{repo}/issues', {
            //repository name and owner name
            owner: 'aycabasDemo',
            repo: 'ContosoProject'
        })

        let issues: githubIssuesModel[] = [];
        for (const obj of resp.data) {
            const tmp: githubIssuesModel = {
                state: obj["state"],
                url: obj["html_url"],
                title: obj["title"],
                body: obj["body"]
            };
            issues.push(tmp);
        }
        return issues;
    } catch (e) {
        throw e;
    }
}

