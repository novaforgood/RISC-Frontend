import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Input, Text } from "../components/atomic";
import { QuestionTypes } from "../components/Form";
import { defaultContentState } from "../components/RichTextEditing";
import UploadIconWithPreview from "../components/UploadIconWithPreview";
import {
  CreateProgramInput,
  useCreateProgramMutation,
  useGetMyUserQuery,
  useUploadImageAndResizeMutation,
} from "../generated/graphql";
import AuthorizationWrapper from "../layouts/AuthorizationWrapper";
import Page from "../types/Page";

const defaultMentorApplication = [
  {
    id: nanoid(),
    title: "Why do you want to be a mentor?",
    description: "Limit your response to 5 sentences.",
    type: QuestionTypes.longText,
  },
];

const defaultMentorProfile = [
  {
    id: nanoid(),
    title: "What was a time when you wish you had a peer mentor?",
    description: "Limit your response to 5 sentences.",
    type: QuestionTypes.longText,
  },
  {
    id: nanoid(),
    title: "Who is your dream dinner guest? Why?",
    description: "Limit your response to 5 sentences.",
    type: QuestionTypes.longText,
  },
];

const defaultMenteeApplication = [
  {
    id: nanoid(),
    title: "What is something you've laughed really hard at?",
    description: "Limit your response to 5 sentences.",
    type: QuestionTypes.longText,
  },
];

const defaultMenteeProfile = [
  {
    id: nanoid(),
    title: "What is something you want your peer mentor to know about you?",
    description: "Limit your response to 5 sentences.",
    type: QuestionTypes.longText,
  },
];

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
  const [enteredCode, setEnteredCode] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);

  const [stage, setStage] = useState(0);
  const [programName, setProgramName] = useState("");
  const [programLogo, setProgramLogo] = useState<File | null>(null);
  const [programLogoURL, setProgramLogoURL] = useState(
    "/static/DefaultLogo.svg"
  );
  const [programIdentifier, setProgramIdentifier] = useState("");
  //const [programIsPublic, setProgramIsPublic] = useState(true); // TODO: add checkbox on form for setting program public or not
  const [createProgram] = useCreateProgramMutation();
  const [error, setError] = useState<String | null>(null); // TODO: Proper error box
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refetch: refetchMyUserData } = useGetMyUserQuery();
  const [uploadImageAndResizeMutation] = useUploadImageAndResizeMutation();

  const validateProgramName = (name: string) => {
    // check string is not whitespace; can ask product for more constraints on names
    return name.length && !name.match(/^\s*$/);
  };

  const validateProgramIdentifier = (name: string) => {
    // check string is valid for url; can ask product for more constraints on names
    return name.length && name.match(/^[a-zA-Z0-9\-]{4,}$/) && !name.match("/");
  };

  const callCreateProgram = async () => {
    let iconUrl = "/static/DefaultLogo.svg";

    if (programLogo) {
      // Ideally, the image upload wouldn't block, but that requires more significant changes to the backend
      // For now, the backend resizes icons to small sizes anyway, so the load time shouldn't be too long
      let imageUrl = await uploadImageAndResizeMutation({
        variables: { file: programLogo, resizeWidth: 256, resizeHeight: 256 },
      });
      if (imageUrl.data) {
        iconUrl = imageUrl.data?.uploadImage;
      }
    }

    const createProgramInput: CreateProgramInput = {
      name: programName,
      description: "", // a lotta dummy strings for now since the form doesn't specify them
      slug: programIdentifier,
      iconUrl: iconUrl,
      homepage: JSON.stringify(defaultContentState),
      mentorProfileSchemaJson: JSON.stringify(defaultMentorProfile),
      menteeProfileSchemaJson: JSON.stringify(defaultMenteeProfile),
      mentorApplicationSchemaJson: JSON.stringify(defaultMentorApplication),
      menteeApplicationSchemaJson: JSON.stringify(defaultMenteeApplication),
      public: true,
    };

    setLoading(true);
    return createProgram({ variables: { data: createProgramInput } })
      .then(async (res) => {
        if (res) {
          if (refetchMyUserData) await refetchMyUserData();
          router.push(`/program/${res.data?.createProgram.slug}/admin`);

          // If we use subdomains
          // router.push(
          //   `http://${res.data?.createProgram.slug}.${window.location.host}`
          // );
        } else {
          throw { message: "Failed to retrieve created program's subdomain" };
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log({ ...err });

        if (err.message.includes("duplicate key value violates unique"))
          setError(`Error: Slug "${programIdentifier}" already exists`);
        else setError("Error: " + err.message);
      });
  };

  const stepOne = () => {
    return (
      <div className="flex flex-col w-9/10 space-y-6">
        <Text h1 b className="whitespace-nowrap">
          Create your Program!
        </Text>
        <div className="h-18" />

        <Text className="text-secondary">
          What is the name of your mentorship program?
        </Text>
        <form className="space-y-6">
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
          <div className="flex justify-between">
            <Button
              type="reset"
              variant="inverted"
              onClick={() => {
                router.back();
              }}
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={programName.length == 0}
              onClick={(e) => {
                e.preventDefault();
                if (validateProgramName(programName)) {
                  setStage((prev) => prev + 1);
                  setError(null);
                } else setError("Please enter a program name.");
              }}
            >
              Next
            </Button>
          </div>
        </form>

        <Text className="text-error">{error}</Text>
      </div>
    );
  };

  const stepTwo = () => {
    return (
      <div className="flex flex-col space-y-10">
        <div>
          <Text h1 b>
            Program Details
          </Text>
          <div className="h-2" />
          <Text className="text-secondary">
            Let's set up some basic information! You can also do these later.
          </Text>
        </div>
        <div>
          <Text b>Logo</Text>
          <div className="h-2" />
          <UploadIconWithPreview
            onFileChanged={setProgramLogo}
            src={programLogoURL}
            onSrcChange={setProgramLogoURL}
          />
        </div>
        <form className="space-y-10">
          <div>
            <Text b>Identifier</Text>
            <div className="h-2" />
            <div className="inline space-x-2">
              <Text b2>www.mentorcenter.us/ </Text>
              <Input
                title="Identifier"
                name="Program Identifier"
                placeholder="mentorship-identifier"
                value={programIdentifier}
                className="flex-1"
                onChange={(e) => {
                  setProgramIdentifier(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="flex">
            <Button
              type="reset"
              variant="inverted"
              onClick={() => {
                setStage((prev) => prev - 1);
              }}
            >
              Back
            </Button>
            <div className="w-4"></div>
            <Button
              type="submit"
              disabled={loading || programIdentifier.length == 0}
              onClick={(e) => {
                e.preventDefault();
                if (loading) return;
                if (!validateProgramIdentifier(programIdentifier))
                  setError(
                    "Your program identifier must be alphanumeric and have at least 4 characters."
                  );
                else if (validateProgramIdentifier(programIdentifier)) {
                  setError(null);
                  callCreateProgram();
                }
              }}
            >
              Create!
            </Button>
          </div>
        </form>

        <Text className="text-error">{error}</Text>
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

  if (!enteredCode) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center gap-2">
        <div>
          Enter code to create program.{" "}
          <Text
            u
            className="cursor-pointer text-secondary"
            onClick={() => {
              router.back();
            }}
          >
            Go back to previous page
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={code}
            onChange={(e) => {
              setCodeError(null);
              setCode(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                if (code === "WelcomeToMentorCenter") {
                  setEnteredCode(true);
                } else {
                  setCodeError("Invalid code.");
                }
              }
            }}
          />
          <Button
            size="auto"
            className="px-3 py-1"
            onClick={() => {
              if (code === "WelcomeToMentorCenter") {
                setEnteredCode(true);
              } else {
                setCodeError("Invalid code.");
              }
            }}
          >
            Enter
          </Button>
        </div>
        <div className="text-error h-4">{codeError}</div>
      </div>
    );
  }

  return (
    <div className="flex w-screen h-screen">
      <div className="w-9/12 h-full flex">
        <img
          src="/static/DarkTextLogo.svg"
          className="absolute p-6 select-none pointer-events-none"
        />
        <div className="m-auto">{renderStage()}</div>
      </div>
      <div className="hidden md:grid md:w-1/3 bg-primary h-screen">
        <div className="place-self-center">
          <BlobCircle />
        </div>
      </div>
    </div>
  );
};

CreateProgramPage.getLayout = (page, _) => (
  <AuthorizationWrapper>{page}</AuthorizationWrapper>
);

export default CreateProgramPage;
