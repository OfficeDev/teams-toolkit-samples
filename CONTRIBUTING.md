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
  - src 
  - assets
      - sampleDemo.gif
  - README.md
  - teamsapp.yml 
  - teamsapp.local.yml
```
The sampleDemo.gif is a very short gif illustrating what users will see after the app is running, and demonstrating major usage of the sample. The gif can also be a static screenshot of the sample if you want.
> Suggested size of gif/pic is *1600x920/800x460* (If you have it with other sizes, please keep same image ratio for other sizes and don't forget to consider the resolution. Your gif or pics must fit the entire Teams client UI into the image.

The README.md file basically describe what's the sample, how to run it and so on. Here is a [README Template](https://github.com/OfficeDev/TeamsFx-Samples/blob/zhany-readme-template/README_template.md) which you can follow to create one.

2. [Log a Issue ticket](https://github.com/OfficeDev/TeamsFx-Samples/issues/new) in our repo using below template, you will need to provide meta data of your sample in your ticket.

3. The things request you to do are almost done. Then we will triage the samples onboarding tickets daily, a PM and a Engineer in our team will be assigned to help you review the source code together with the meta data you provided in the ticket. Please keep an eye on your ticket and update your samples accordingly if there is any updating request during the review.

## Responsibility statement for contributors

 The sample contributors are responsible for maintaining and updating the samples so that ensure the smooth experience in Teams Toolkit. 

- Upgrade the sample to new version when there's breaking change in new Teams Toolkit releases.
- Fix bugs that are related to sample business logic.

If the sample cannot pass our test or required to be upgraded, an email will be sent to sample contributor as maintainance notification. In case the sample is losing maintainance, there is a chance that we will remove the sample from our sample gallery.
   
# Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/)
or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

# Submitting issues

The issue tracker is for **[issues](https://github.com/OfficeDev/TeamsFx-Samples/issues)**, in other words, bugs and suggestions.
If you have a *question*, *feedback* or *suggestions*, please check our [support page](https://docs.microsoft.com/microsoftteams/platform/feedback).
