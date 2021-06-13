import { useRouter } from "next/router";
import { useGetProgramBySlugQuery } from "../generated/graphql";
import { parseParam } from "../utils";

const useCurrentProgram = () => {
  const router = useRouter();
  const slug = parseParam(router.query.slug);

  const { data } = useGetProgramBySlugQuery({ variables: { slug: slug } });

  return { currentProgram: data?.getProgramBySlug };
};

export default useCurrentProgram;
