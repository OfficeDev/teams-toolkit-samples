# Contributing

## Statement
This repository welcomes contributions and suggestions. Most contributions require you to
agree to a Contributor License Agreement (CLA) declaring that you have the right to,
and actually do, grant us the rights to use your contribution. For details, visit
https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need
to provide a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the
instructions provided by the bot. You will only need to do this once across all repositories using our CLA.

## How to submit your sample
To give you an overview of the process to contribute to our samples repo, you will be going through this:

![Sample Onboarding Process](../assets/contributing_process.png)

> The purple blocks are things you will need to do.
> The green blocks are what we will take care of.

Before your start, you might want to know whether you will need to commit your source code to our repo. In most of cases, your Teams sample source code will need to be commited to our repo, especially when you are an individual contributor. In some special cases if you are our partner team who maintains Teams samples repo as well, your source code can be resides in your own open source repo. We will reference to your repo and expose your sample to Teams Toolkit sample gallery.

Some explaination of how to perform each step in above process:
1. Submit your source code by creating a pull request to our repo (target `dev` branch by default), a typical project is in below structure. Make sure you have the `sampleDemo.gif` and `README.md` files included in your source code. 

> You can run the [Sample Validatioin Tool](https://github.com/OfficeDev/TeamsFx-Samples/tree/dev/validation-tool) before raising the PR to make sure your sample satisfies our requirements.

```
- sampleTeamsProject
  - appPackage 
      - color.png
      - manifest.json
      - outline.png 
  - env 
  - infra
  - src 
  - assets
      - sampleDemo.gif
  - README.md
  - teamsapp.yml 
  - web.config 
```
The sampleDemo.gif is a very short gif illustrating what users will see after the app is running, and demonstrating major usage of the sample. The gif can also be a static screenshot of the sample if you want.
> Suggested size of gif/pic is *1600x920/800x460* (If you have it with other sizes, please keep same image ratio for other sizes and don't forget to consider the resolution. Your gif or pics must fit the entire Teams client UI into the image.

The README.md file basically describe what's the sample, how to run it and so on. Here is a [README Template](https://github.com/OfficeDev/TeamsFx-Samples/blob/zhany-readme-template/README_template.md) which you can follow to create one.

2. [Log a Issue ticket](https://github.com/OfficeDev/TeamsFx-Samples/issues/new) in our repo use below template, you will need to provide meta data of your sample in your ticket:
```
Title: [Sample Onboard Request]{Your Sample Name}
```
> You can directly copy the template content
```
Sample Onboard Request template

[Required field] ID: {Replace with your sample ID} (e.g. "hello-world-sample")
[Required field] Title: {Replace with your sample name} (e.g. "Hello World Sample")
[Required field] Description: {Replace with one or two sentence that introduce this sample}
[Required field] OnboardDate: {Replace with year/mon/day} (e.g. 2023/08/08)
[Required field] Tags: {Sample labels} (see explaination below)
[Required field] Time: {The estimation time to run the sample} (e.g. "5mins to run")
[Required field] Configuration: {does the sample require additional manual steps to config before it can run} (value: "Ready for local debug"/"Manual configurations required")
[Required field] Screenshot/Gif: {the file path where you put the gif/pics, typically it's in assets folder but you can put it anywhere you want.}
[Optional field] SampleUrl: {Required field when your sample code resides in another sample repo}
[Optional field] MinTTKversion: {Teams Toolkit version requirement to run the sample - minimum version}
[Optional field] MaxTTKVersion: {Teams Toolkit version requirement to run the sample - maximum version}
```
You can give your samples a set of tags so that users can easily locate your sample from a group of samples. Those tags can be:
 - the programming languages you used, e.g. "JS", "TS", "C#" etc.
 - the Teams app type, e.g. "Tab", "Bot", "Message Extension" etc.
 - the highlighted technics you used, e.g. "React", "Azure Function", "Graph Toolkit", "Teams AI SDK", "Live Share SDK" etc.
 - the business scenarios of your sample, e.g. "Team Dashboard", "Productivity", "Notification", "Q&A" etc.

You can customize the tag you used for your sample, the recommended number of tags is less than 5.

3. The things request you to do are almost done. Then we will triage the samples onboarding tickets daily, a PM and a Engineer in our team will be assigned to help you review the source code together with the meta data you provided in the ticket. Please keep an eye on your ticket and update your samples accordingly if there is any updating request during the review.

## How to maintain your sample

Please be noted that you are the maintainer of your sample. You're responsible for updating your sample to make it work in Teams Toolkit under following circumstances:

- Upgrade the sample to new version when there's breaking change in new Teams Toolkit releases. If not upgrade, treat it as deprecated.  
- Fix bugs that are related to sample business logic.

When we found issues of sample or miration needed, we'll trigger email to sample contributor to inform you to maintain. If not upgraded or fixed in a certain time, we'll treat it as deprecated.
   
# Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/)
or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

# Submitting issues

The issue tracker is for **[issues](https://github.com/OfficeDev/TeamsFx-Samples/issues)**, in other words, bugs and suggestions.
If you have a *question*, *feedback* or *suggestions*, please check our [support page](https://docs.microsoft.com/microsoftteams/platform/feedback).
