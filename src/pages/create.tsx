import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Input, Text } from "../components/atomic";
import {
  CreateProgramInput,
  useCreateProgramMutation,
  useGetMyUserQuery,
} from "../generated/graphql";
import RedirectIfNotLoggedIn from "../layouts/RedirectIfNotLoggedIn";
import Page from "../types/Page";

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

const CreateProgramPage: Page = () => {
  const [stage, setStage] = useState(0);
  const [programName, setProgramName] = useState("");
  const [programLogo, setProgramLogo] = useState("");
  const [programIdentifier, setProgramIdentifier] = useState("");
  //const [programIsPublic, setProgramIsPublic] = useState(true); // TODO: add checkbox on form for setting program public or not
  const [createProgram] = useCreateProgramMutation();
  const [displayError, setError] = useState(""); // TODO: Proper error box
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refetch: refetchMyUserData } = useGetMyUserQuery();

  const validateProgramName = (name: string) => {
    // check string is not whitespace; can ask product for more constraints on names
    return name.length && !name.match("^\\s*$");
  };

  const validateProgramIdentifier = (name: string) => {
    // check string is valid for url; can ask product for more constraints on names
    return name.length && !name.match("\\s") && !name.match("/");
  };

  const callCreateProgram = () => {
    const createProgramInput: CreateProgramInput = {
      name: programName,
      description: "", // a lotta dummy strings for now since the form doesn't specify them
      slug: programIdentifier,
      iconUrl: programLogo,
      homepage: programIdentifier,
      mentorProfileSchemaJson: "",
      menteeProfileSchemaJson: "",
      mentorApplicationSchemaJson: "",
      menteeApplicationSchemaJson: "",
      public: true,
    };

    setLoading(true);
    return createProgram({ variables: { data: createProgramInput } })
      .then(async (res) => {
        if (res) {
          if (refetchMyUserData) await refetchMyUserData();
          router.push(`/program/${res.data?.createProgram.slug}`);

          // If we use subdomains
          // router.push(
          //   `http://${res.data?.createProgram.slug}.${window.location.host}`
          // );
        } else {
          throw { message: "Failed to retrieve created program's subdomain" };
        }
      })
      .catch((err) => {
        console.log({ ...err });

        if (err.message.includes("duplicate key value violates unique"))
          setError(`Error: Slug "${programIdentifier}" already exists`);
        else setError("Error: " + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const stepOne = () => {
    return (
      <div className="flex flex-col w-full px-4 py-12 md:w-152">
        <Text h1 b className="whitespace no-wrap">
          Create your mentorship!
        </Text>
        <div className="h-6" />

        <Text className="text-secondary">
          What is the name of your mentorship program?
        </Text>
        <div className="h-6" />

        <div className="w-full">
          <Input
            name="Program Name"
            placeholder="e.g. Nova Mentorship"
            value={programName}
            className="w-full"
            onChange={(e) => {
              setProgramName(e.target.value);
            }}
          />
        </div>
        <div className="h-3" />

        <Button
          disabled={programName.length == 0}
          onClick={() => {
            if (validateProgramName(programName)) {
              setStage((prev) => prev + 1);
              setError("");
            } else setError("Please enter a program name.");
          }}
        >
          Next
        </Button>
        <div className="h-6" />

        <Text className="text-error">{displayError}</Text>
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
          <Button
            variant="inverted"
            onClick={() => {
              setStage((prev) => prev - 1);
            }}
          >
            Back
          </Button>
          <div className="w-2"></div>
          <Button
            disabled={programIdentifier.length == 0}
            onClick={() => {
              if (!validateProgramIdentifier(programIdentifier))
                setError(
                  "Your program identifier cannot contain slashes or spaces"
                );
              else if (
                !loading &&
                validateProgramIdentifier(programIdentifier)
              ) {
                setError("");
                callCreateProgram();
              }
            }}
          >
            Create!
          </Button>
        </div>
        <div className="h-6" />

        <Text className="text-error">{displayError}</Text>
      </div>
    );
  };
  const renderStage = () => {
    switch (stage) {
      case 0:
        return stepOne();
      case 1:
        return stepTwo();
      default:
        return <Text>Placeholder (Should not show)</Text>;
    }
  };
  return (
    <div className="flex w-screen min-h-screen">
      <img
        src="/static/TextLogo.svg"
        className="absolute p-6 select-none pointer-events-none"
      />
      <div className="w-full md:w-2/3 flex justify-center items-center min-h-screen">
        {renderStage()}
      </div>
      <div className="hidden md:grid md:w-1/3 bg-primary min-h-screen relative">
        <div className="place-self-center">
          <BlobCircle />
        </div>
      </div>
    </div>
  );
};

CreateProgramPage.getLayout = (page, _) => (
  <RedirectIfNotLoggedIn pathAfterLoggingIn="/create">
    {page}
  </RedirectIfNotLoggedIn>
);

export default CreateProgramPage;
