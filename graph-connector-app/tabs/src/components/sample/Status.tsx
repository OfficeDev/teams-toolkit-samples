import { AcceptIcon, CloseIcon, PlayIcon } from "@fluentui/react-northstar";

export function Status(props: { currentStep: number, targetStep: number, error: any, text: string }) {
  function getRunningStauts(currentStep: number, targetStep: number) {
    if (currentStep < targetStep - 1) {
      return "";
    } else if (currentStep === targetStep - 1) {
      return props.error ? <CloseIcon /> : <PlayIcon />;
    } else {
      return <AcceptIcon />;
    }
  }

  return (
    <div>
      {getRunningStauts(props.currentStep, props.targetStep)} {props.targetStep}. {props.text}
    </div>
  );
}
