export function checkExecutionResult({
  status,
  expected_output,
  stdout,
  time,
  memory,
}) {
  if (!status || !expected_output || !stdout) {
    return {
      success: false,
      code: 400,
      message: "Missing required fields.",
    };
  }

  if (status.id === 3) {
    return {
      success: true,
      code: 200,
      message: status.description,
      time: time,
      memory: memory,
    };
  }

  if (status.id === 4) {
    return {
      success: false,
      code: 200,
      message: status.description,
      expected_output,
      your_output: stdout,
      time: time,
      memory: memory,
    };
  }

  return {
    success: false,
    code: 500,
    message: "Unknown execution status.",
  };
}
