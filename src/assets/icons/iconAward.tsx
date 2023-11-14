import Icon, {
  CustomIconComponentProps,
} from "@ant-design/icons/lib/components/Icon";

const awardSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    width="44"
    height="44"
    viewBox="0 0 367.424 367.424"
    fill="currentColor"
  >
    <path d="M331.832,324.933c-14.176-33.603-62.084-139.134-62.084-139.134c16.688-19.688,26.781-45.129,26.781-72.893    C296.529,50.65,245.881,0,183.625,0C121.37,0,70.719,50.65,70.719,112.906c0,27.764,10.096,53.205,26.781,72.893L35.297,325.877    c-1.396,3.145-0.723,6.828,1.699,9.273c2.422,2.442,6.084,3.161,9.258,1.801l41.352-17.828l14.506,42.633    c1.109,3.26,4.104,5.506,7.541,5.66c0.127,0.004,0.254,0.008,0.377,0.008c3.295,0,6.297-1.938,7.645-4.969l60.736-136.779    c1.73,0.082,3.467,0.135,5.215,0.135s3.482-0.053,5.215-0.135l60.736,136.779c1.348,3.028,4.348,4.969,7.645,4.969    c0.123,0,0.248-0.004,0.375-0.008c3.439-0.154,6.432-2.4,7.543-5.66l14.506-42.633l41.064,17.545    c1.07,0.459,2.193,0.684,3.309,0.684c0.033,0,0.074,0,0.086,0c4.623,0,8.393-3.353,8.727-8.051    C332.908,328.216,332.666,326.907,331.832,324.933z M111.063,336.131l-10.537-30.967c-0.75-2.209-2.393-4.002-4.523-4.949    c-1.078-0.477-2.238-0.719-3.395-0.719c-1.127,0-2.254,0.229-3.312,0.682l-30.035,12.951l50.891-114.602    c14.322,12.305,31.727,21.104,50.908,25.018L111.063,336.131z M87.445,112.906c0-53.035,43.145-96.18,96.18-96.18    c53.033,0,96.177,43.145,96.177,96.18c0,53.033-43.145,96.178-96.177,96.178C130.59,209.084,87.445,165.94,87.445,112.906z     M277.953,300.178c-2.141-0.914-4.574-0.901-6.705,0.037c-2.133,0.947-3.773,2.74-4.525,4.949l-10.535,30.967l-49.996-112.586    c19.18-3.912,36.586-12.713,50.906-25.018l50.891,114.602L277.953,300.178z" />
  </svg>
);
const AwardSvg = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={awardSvg} {...props} />
);

export default AwardSvg;
