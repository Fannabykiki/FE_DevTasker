import Icon, {
  CustomIconComponentProps,
} from "@ant-design/icons/lib/components/Icon";

const notePadSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="44"
    height="44"
    viewBox="0 0 358 511.48"
    fill="currentColor"
  >
    <path d="M24.62 30.28h36.75V0H79v30.28h54.91V0h17.63v30.28h54.91V0h17.64v30.28h54.9V0h17.64v30.28h36.75c6.75 0 12.9 2.77 17.38 7.24 4.47 4.44 7.24 10.6 7.24 17.37v431.97c0 6.77-2.79 12.92-7.24 17.37-4.47 4.46-10.65 7.25-17.38 7.25H24.62c-6.74 0-12.91-2.78-17.38-7.25C2.79 499.78 0 493.64 0 486.86V54.89c0-6.75 2.77-12.9 7.22-17.36l.04-.03c4.45-4.45 10.6-7.22 17.36-7.22zm272.11 401.76H61.27v-17.63h235.46v17.63zm0-71.44H61.27v-17.63h235.46v17.63zm0-71.44H61.27v-17.63h235.46v17.63zm0-71.44H61.27v-17.64h235.46v17.64zm0-71.44H61.27v-17.64h235.46v17.64zm-.1-98.37v18.52h-17.64V47.91h-54.9v18.52h-17.64V47.91h-54.91v18.52h-17.63V47.91H79v18.52H61.37V47.91H24.62c-1.93 0-3.68.79-4.95 2.04a7.046 7.046 0 0 0-2.04 4.94v431.97c0 1.89.81 3.63 2.08 4.9 1.28 1.28 3.03 2.08 4.91 2.08h308.76c1.88 0 3.63-.8 4.91-2.08 1.27-1.27 2.08-3.02 2.08-4.9V54.89c0-1.9-.8-3.65-2.07-4.92a6.822 6.822 0 0 0-4.92-2.06h-36.75z" />
  </svg>
);
const NotePadSvg = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={notePadSvg} {...props} />
);

export default NotePadSvg;
