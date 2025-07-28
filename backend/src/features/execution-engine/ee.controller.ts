import { HttpStatus } from "../../utils/http-status.js";
import axios from "axios";
import { checkExecutionResult } from "../../utils/check-execution-result.js";

const ExecutionController = {
  run: async (req, res) => {
    const user = req.user;
    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized." });
    }

    const { source_code, language_id, stdin, expected_output } = req.body;
    if (!source_code || !language_id || !stdin || !expected_output) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Missing required fields." });
    }

    try {
      const payload = {
        source_code,
        language_id,
        stdin,
        expected_output,
      };

      const response = await axios.post(
        "http://localhost:2358/submissions?base64_encoded=false&wait=true",
        payload
      );

      if (!response || !response.data) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Failed to get response from Judge0." });
      }

      const result = checkExecutionResult({
        status: response.data.status,
        expected_output,
        stdout: response.data.stdout,
        time: response.data.time,
        memory: response.data.memory,
      });

      if (result.code === 400) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: result.message });
      }

      return res.status(result.code).json(result);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error", error });
    }
  },
};

export default ExecutionController;
