import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const StepperWithContent = ({ status, rejection, data }) => {
  const isStepFailed = (step) => {
    return step === rejection - 1;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper
        activeStep={
          rejection
            ? rejection - 1
            : status == data.length - 1
            ? status + 1
            : status
        }
        alternativeLabel
      >
        {data.map((label, index) => {
          const labelProps = {};
          if (isStepFailed(index)) {
            labelProps.error = true;
          }
          return (
            <Step key={label}>
              <StepLabel sx={{ fontFamily: "cursive" }} {...labelProps}>
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default StepperWithContent;
