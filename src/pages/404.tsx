import ErrorScreen, { ErrorScreenType } from "../components/ErrorScreen";

function NotFoundPage() {
  return <ErrorScreen type={ErrorScreenType.PageNotFound} />;
}

export default NotFoundPage;
