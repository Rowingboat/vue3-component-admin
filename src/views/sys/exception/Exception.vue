<script>
// import { ref, unref } from "vue"
// import { Result, Button } from 'ant-design-vue';
import { ExceptionEnum } from '@/enums/exceptionEnum';

export default {
    name: 'ErrorPage',
    props: {
        status: { type: Number, default: ExceptionEnum.PAGE_NOT_FOUND },
        title: { type: String, default: '' },
        subTitle: { type: String, default: '' },
        full: { type: Boolean, default: false },
    },
    setup() {
        // return () => {
        //     return (
        //         <Result>
        //         {{
        //       extra: () =>
        //         btnText && (
        //           <Button type="primary" onClick={handler}>
        //             {() => btnText}
        //           </Button>
        //         ),
        //       icon: () => (icon ? <img src={icon} /> : null),
        //     }}
        //         </Result>
        //     )
        // }
    },
};
</script>
