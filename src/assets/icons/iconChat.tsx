import Icon, {
  CustomIconComponentProps,
} from "@ant-design/icons/lib/components/Icon";

const chatSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="44" height="37">
    <path
      fill="transparent"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      fillRule="nonzero"
      d="M0.9999998278276596,8.350050969124272 L0.9999998278276596,8.350050969124272 C0.9999998278276596,6.332092840859206 2.9229664491157585,4.696214780057847 5.295065658665692,4.696214780057847 L7.247369338204415,4.696214780057847 L7.247369338204415,4.696214780057847 L16.618424232699354,4.696214780057847 L34.18914728567157,4.696214780057847 C35.328272439988105,4.696214780057847 36.42073855221119,5.081170662814733 37.226221492715275,5.766398445867784 C38.0316994017812,6.451626228920805 38.48421563222863,7.380994219510109 38.48421563222863,8.350050969124272 L38.48421563222863,17.484642486781283 L38.48421563222863,17.484642486781283 L38.48421563222863,22.96539572538988 L38.48421563222863,22.96539572538988 C38.48421563222863,24.98335489864597 36.561250268800094,26.61923191445632 34.189148543531104,26.61923191445632 L16.618425490558838,26.61923191445632 L4.376298629360333,35.910088254606904 L7.247370596063959,26.61923191445632 L5.295066916525185,26.61923191445632 C2.9229677069753137,26.61923191445632 1.0000010856872255,24.98335489864597 1.0000010856872255,22.96539572538988 L1.0000010856872255,22.96539572538988 L1.0000010856872255,17.484642486781283 L1.0000010856872255,17.484642486781283 L0.9999998278276596,8.350050969124272 z"
    />
  </svg>
);
const ChatSvg = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={chatSvg} {...props} />
);

export default ChatSvg;