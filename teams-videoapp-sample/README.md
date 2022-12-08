# How to use this HelloWorld Video Filter app

> Important: Please be advised that access tokens are stored in sessionStorage for you by default. This can make it possible for malicious code in your app (or code pasted into a console on your page) to access APIs at the same privilege level as your client application. Please ensure you only request the minimum necessary scopes from your client application, and perform any sensitive operations from server side code that your client has to authenticate with.

## Prerequisites

- [NodeJS](https://nodejs.org/en/)
- [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit)

## Run the app in Video Extensibility Test App

- In Visual Studio Code: Start debugging the project by hitting the `F5` key in your keyboard. 
  - Alternatively open the `Run and Debug Activity` panel(Ctrl+Shift+D) in Visual Studio Code and click the `Run and Debug` green arrow button.
- Teams Toolkit will install Video Extensibility Test App (hereinafter Test App) if you are running Video Filter app for the first time.
- The Test App will launch with a prompt asking for your consent. 
- After acknowledging the statement, Test App will load the sample Video Filter app. You may switch between different filter options to inspect the effect.

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
