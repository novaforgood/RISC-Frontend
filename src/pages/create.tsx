import { useState } from "react";
import { Text, Button, Input } from "../components/atomic";
import {
  useCreateProgramMutation,
  CreateProgramInput,
} from "../generated/graphql";
import TitledInput from "../components/TitledInput";

const BlobCircle = () => {
  const sizes = "h-24 w-24 md:h-64 md:w-64 lg:h-80 lg:w-80";
  return (
    <div
      className={`${sizes} rounded-full bg-primary flex justify-center items-end pointer-events-none`}
    >
      <img src="/static/CreateBlobs.svg" className="w-11/12 select-none" />
    </div>
  );
};

const CreateProgramPage = () => {
  const [stage, setStage] = useState(0);
  const [programName, setProgramName] = useState("");
  const [programLogo, setProgramLogo] = useState("");
  const [programIdentifier, setProgramIdentifier] = useState("");

  //const [programIsPublic, setProgramIsPublic] = useState(true); // TODO: add checkbox on form for setting program public or not
  const [createProgram] = useCreateProgramMutation();
  const [displayError, setError] = useState("");

  const stepOne = () => {
    return (
      <div className="flex flex-col w-full px-4 py-12 md:w-152">
        <Text h1 b className="whitespace no-wrap">
          Create your mentorship!
        </Text>
        <div className="h-6" />

        <div className="flex w-full">
          <TitledInput
            title="What is the name of your mentorship program?"
            name="Program Name"
            placeholder="e.g. Nova Mentorship"
            value={programName}
            className="flex-1"
            onChange={(e) => {
              setProgramName(e.target.value);
            }}
          />
        </div>
        <div className="h-3" />

        <Button
          disabled={programName.length == 0}
          onClick={() => {
            if (programName) {
              setStage((prev) => prev + 1);
              setError("");
            } else setError("Please enter a program name.");
          }}
        >
          Next
        </Button>
        <div className="h-6" />

        <Text className="text-error">
          {displayError + "TODO: Proper error box"}
        </Text>
      </div>
    );
  };

  const stepTwo = () => {
    return (
      <div className="flex flex-col w-full px-4 py-12 md:w-120">
        <Text h1 b>
          Program Details
        </Text>
        <Text>
          Let's set up some basic information! You can also do these later.
        </Text>
        <div className="h-6" />
        <div>
          <Text b>Logo</Text>
          <div className="h-1" />
          <Button variant="inverted" size="small">
            Choose File
          </Button>
          <input // TODO: display preview of logo
            type="file"
            name="Program Logo"
            value={programLogo}
            className="flex-1"
            onChange={(e) => {
              setProgramLogo(e.target.value);
            }}
          />
        </div>

        <div className="h-6" />
        <Text b>Identifier</Text>
        <div className="inline">
          <Text b2>www.mentorcenter.us/</Text>
          <Input
            title="Identifier"
            name="Program Identifier"
            placeholder="nova-mentorship"
            value={programIdentifier}
            className="flex-1"
            onChange={(e) => {
              setProgramIdentifier(e.target.value);
            }}
          />
        </div>

        <div className="h-3" />
        <div className="flex">
          <Button variant="inverted">Back</Button>
          <div className="w-2"></div>
          <Button
            onClick={() => {
              if (displayError) {
                // TODO: error, check identifier, bad file?
              } else {
                const createProgramInput: CreateProgramInput = {
                  name: programName,
                  description: "", // a lotta dummy strings for now since the form doesn't specify them
                  slug: programIdentifier,
                  iconUrl: programLogo,
                  homepage: programIdentifier,
                  mentorProfileSchemaJson: "",
                  menteeProfileSchemaJson: "",
                  mentorApplicationSchemaJson: "",
<<<<<<< HEAD
                  public: true,
=======
                  public: programPublic,
>>>>>>> c4693a5 (connect createProgram mutation)
                };
                createProgram({ variables: { data: createProgramInput } });
                setStage((prev) => prev + 1);
                setError("");
              }
            }}
          >
            Create!
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-screen min-h-screen">
      <img
        src="/static/TextLogo.svg"
        className="absolute p-6 select-none pointer-events-none"
      />
      <div className="w-full md:w-2/3 flex justify-center items-center min-h-screen">
        {stage == 0 ? (
          stepOne()
        ) : stage == 1 ? (
          stepTwo()
        ) : (
          <Text>Redirecting u home~</Text> // TODO: actual redirect
        )}
      </div>
      <div className="hidden md:grid md:w-1/3 bg-primary min-h-screen relative">
        <div className="place-self-center">
          <BlobCircle />
        </div>
      </div>
    </div>
  );
};

export default CreateProgramPage;
