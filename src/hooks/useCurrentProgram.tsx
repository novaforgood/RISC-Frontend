import { useRouter } from "next/router";
import { useGetProgramBySlugQuery } from "../generated/graphql";
import { parseParam } from "../utils";
import { useAuth } from "../utils/firebase/auth";

const useCurrentProgram = () => {
  const { user } = useAuth();
  const router = useRouter();
  const slug = parseParam(router.query.slug);

  // NOTE: Not sure if getProgramBySlug should require authorization.
  //       Assume it does for now.
  const { data } = useGetProgramBySlugQuery({
    skip: !user,
    variables: { slug: slug },
  });

  return { currentProgram: data?.getProgramBySlug };
};

export default useCurrentProgram;
