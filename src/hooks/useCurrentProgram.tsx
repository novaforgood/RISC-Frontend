import { useCallback } from "react";
import { useRouter } from "next/router";
import { useGetProgramBySlugQuery } from "../generated/graphql";
import { parseParam } from "../utils";

const useCurrentProgram = () => {
  const router = useRouter();
  const slug = parseParam(router.query.slug);

  const { data, refetch } = useGetProgramBySlugQuery({
    variables: { slug: slug },
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
  });

  const refetchQuery = useCallback(() => {
    return refetch({ slug: slug });
  }, [slug]);

  return {
    currentProgram: data?.getProgramBySlug,
    refetchCurrentProgram: refetchQuery,
  };
};

export default useCurrentProgram;
