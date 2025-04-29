import {
  Checkmark16Filled,
  Dismiss16Filled,
  Play16Filled,
} from "@fluentui/react-icons";

export function Status(props: {
  currentStep: number;
  targetStep: number;
  error: any;
  text: string;
}) {
  function getRunningStauts(currentStep: number, targetStep: number) {
    if (currentStep < targetStep - 1) {
      return "";
    } else if (currentStep === targetStep - 1) {
      return props.error ? <Dismiss16Filled /> : <Play16Filled />;
    } else {
      return <Checkmark16Filled />;
    }
  }

  return (
    <div>
      {getRunningStauts(props.currentStep, props.targetStep)} {props.targetStep}
      . {props.text}
    </div>
  );
}
