# This repo demonstrates a minimal Teams video app.
This repo contains:
1. A minimal sample app with basic video processing capabilities.
2. A test app can be used to test video app functionality in early development stage and provides performance evaluation tools.

The following steps shows how to create a video app on your own based on this sample, and how to improve it so that it can implement all kinds of video effects you want.

## Prerequisites

1. Install git on your machine following this [instructions](https://github.com/git-guides/install-git)
2. Install Node. [Node.js](https://nodejs.org/en/).
3. Install [Yarn](https://yarnpkg.com/en/)

## Dowmload and start video app in local

1. `git clone https://github.com/microsoft/teams-videoapp-sample.git`
2. `cd` to the directory of README.md.
3. run `yarn install`.
4. run `yarn dev`, this will host the app in local environment or you can host the `src` folder on other place can access.
5. The app will be hosted in `https://127.0.0.1:5173/`.

## Load and test sample video app in local using test app

1. go to `test-app` folder and unzip the latest test app according to your enviornment.
2. Open the `.exe` file under the root folder.
3. copy `https://127.0.0.1:5173/` or URL if you host on the place to test-app 'Video app url' input box and then click 'Load' button.
4. Then it will show sample video app page in the right panel of test app.
5. Click on the video effect thumbnail, it will apply the corresponding effect to the video frame showing at left side of test app. 

## Develop your own video effects

If you want to add your own video effects:
1. Add your `effectId` and corresponding handler in `videoFrameHandler` function in `src/index.js`
2. Add thumbnail for your newly added effect in `index.html`.
3. Bind the newly added handler function you created in `src/index.js` with the newly added thubnail in `index.html` as it's `onClick` callback function.
2. This sample video app processes the video frame in main thread for simplicity, you can move the frame processing to worker thread to improve performance if needed.

## Teams Video API reference

If you want to know details about how video app interacts with Teams SDK API:
#### You can find the Teams video extensibility API [link](https://github.com/OfficeDev/microsoft-teams-library-js/blob/main/packages/teams-js/src/public/video.ts)

### API reference
There are three API for video extensibility
```javascript
registerForVideoFrame(frameCallback, config) 
```
#### Register a callback to get: 
- video frames from video pipeline.
- a callback to return processed video frames to video pipeline. 
- a callback to notify error 

```javascript
registerForVideoEffect(callback)
```
- Get notification that the selected effect in video app’s UI should be applied
```javascript
 notifySelectedVideoEffectChanged(
    effectChangeType,
    effectId,
  ) 
  ```
  - Whenever the user selects a different effect in a video app, the video app should call this API to notify Teams client. 

## How to test performance in test app?

1. Load video app in test app.
2. To evaluate processing time, click `Real-time Evaluation` or `Full Evaluation` under `Time per Frame`. 
    - `Real-time Evaluation` logs the average and range of processing time in millisecond in each second.
    - `Full Evaluation` logs both the processing time and the distribution of processing time.
3. To evaluate memory usage, click `Real-time Evaluation` or `Full Evaluation` under `Memory Usage'. 
    - `Real-time Evaluation` logs the average and range of both active heap size and total heap size for each frame.
    - `Full Evaluation` logs both the heap size and the distribution of heap size.
4. To test video app under different resolutions, click `Reduce the resolution by half`, `Same`, or `Double the resolution`. 

## FAQ: There's no device shown in the 'Camera' dropdown.

1. Make sure your camera has been plugged into your computer.
2. Delete `%appdata%\Microsoft\electron` folder.

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
