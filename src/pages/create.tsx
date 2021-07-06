import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Input, Text } from "../components/atomic";
import { defaultContentState } from "../components/RichTextEditing";
import UploadIconWithPreview from "../components/UploadIconWithPreview";
import {
  CreateProgramInput,
  useCreateProgramMutation,
  useGetMyUserQuery,
  useUploadImageAndResizeMutation,
} from "../generated/graphql";
import { AccessLevel, useRedirectFromAuthorization } from "../hooks";
import RedirectIfNotLoggedIn from "../layouts/RedirectIfNotLoggedIn";
import Page from "../types/Page";

const EXAMPLE_MENTOR_APPLICATION = `[{"id":"b8AJJ84IzMFWGTkt_lxG9","title":"Why do you want to join this program?","description":"It helps to be specific with your answer!","type":"long-answer"},{"id":"zXA9E77Mcglv_0LV4Hv8H","title":"What specific skills or experiences do you have that make you fit for this program?","description":"","type":"long-answer"}]`;
const EXAMPLE_MENTOR_PROFILE = `[{"id":"j2dVlUIKow3HqSxVX5Hxp","title":"What are you looking for out of potential mentees?","description":"","type":"short-answer"},{"id":"bXB9TrYI1IJWlOlDE7k_n","title":"Tell us a little bit about your profession/position/other.","description":"","type":"long-answer"}]`;
const EXAMPLE_MENTEE_APPLICATION = `[{"id":"qlEHm6cKjuX3nHSchVBGL","title":"What do you hope to get from joining our program?","description":"It helps to be specific here!","type":"long-answer"},{"id":"3x7BYtuTIttI9NiAw-46o","title":"How did you find out about us?","description":"","type":"short-answer"}]`;
const EXAMPLE_MENTEE_PROFILE = `[{"id":"KDAhd2WnA4RfnLKZzZbaF","title":"What are you looking for from a mentor?","description":"It helps to be specific here!","type":"long-answer"},{"id":"pD2qaE7YAZppUcC9lwGtf","title":"What are some of your goals?","description":"","type":"short-answer"}]`;

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
  useRedirectFromAuthorization(AccessLevel.VERIFIED);

  const [stage, setStage] = useState(0);
  const [programName, setProgramName] = useState("");
  const [programLogo, setProgramLogo] = useState<File | null>(null);
  const [programLogoURL, setProgramLogoURL] = useState(
    "/static/DefaultLogo.svg"
  );
  const [programIdentifier, setProgramIdentifier] = useState("");
  //const [programIsPublic, setProgramIsPublic] = useState(true); // TODO: add checkbox on form for setting program public or not
  const [createProgram] = useCreateProgramMutation();
  const [displayError, setError] = useState(""); // TODO: Proper error box
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
      mentorProfileSchemaJson: EXAMPLE_MENTOR_PROFILE,
      menteeProfileSchemaJson: EXAMPLE_MENTEE_PROFILE,
      mentorApplicationSchemaJson: EXAMPLE_MENTOR_APPLICATION,
      menteeApplicationSchemaJson: EXAMPLE_MENTEE_APPLICATION,
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
      <div className="flex flex-col w-9/10 space-y-6">
        <Text h1 b className="whitespace-nowrap">
          Create your mentorship!
        </Text>
        <div className="h-18" />

        <Text className="text-secondary">
          What is the name of your mentorship program?
        </Text>

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

        <Text className="text-error">{displayError}</Text>
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

        <div>
          <Text b>Identifier</Text>
          <div className="h-2" />
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
        </div>

        <div className="flex">
          <Button
            variant="inverted"
            onClick={() => {
              setStage((prev) => prev - 1);
            }}
          >
            Back
          </Button>
          <div className="w-4"></div>
          <Button
            disabled={programIdentifier.length == 0}
            onClick={() => {
              if (!validateProgramIdentifier(programIdentifier))
                setError(
                  "Your program identifier must be alphanumeric and have at least 4 characters."
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
  <RedirectIfNotLoggedIn pathAfterLoggingIn="/create">
    {page}
  </RedirectIfNotLoggedIn>
);

export default CreateProgramPage;
