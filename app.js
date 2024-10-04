var viewer;

/**
 * ReportViewer 객체 생성
 * @param {string} containerId Div Container ID값
 * {@link https://real-report.com/docs/api/ReportViewer#%EC%83%9D%EC%84%B1%EC%9E%90}
 */
function initViewer(containerId) {
    viewer = new RealReport.ReportViewer(containerId);
}

/**
 * ReportViewer 객체에 출력할 양식을 설정합니다.
 * @param {json} reportForm
 * {@link https://real-report.com/docs/api/ReportViewer#reportform}
 */
function setReport(reportForm) {
    if (!viewer) return;

    viewer.reportForm = reportForm;
}

/**
 * 출력할 양식에 사용할 데이터를 설정합니다.
 * @param {*} data
 * {@link https://real-report.com/docs/api/ReportViewer#dataset}
 * @see {@link https://real-report.com/docs/viewer/03-data#%EC%97%AC%EB%9F%AC%EA%B0%9C%EC%9D%98-%EB%8D%B0%EC%9D%B4%ED%84%B0}
 * @see {@link https://www.youtube.com/watch?v=p-RnBR8aCtE}
 */
function setDataSet(dataSet) {
    if (!viewer) return;

    viewer.dataSet = dataSet;
}

/**
 * 현재 설정되어있는 양식과 데이터로 미리보기 진행
 * {@link https://real-report.com/docs/api/ReportViewer#preview}
 */
function preview() {
    if (!viewer) return;

    viewer.preview({
        async: true,
        endCallback: () => {
            console.log('미리보기 완료');
        },
    });
}

/**
 * 현재 설정되어있는 양식과 데이터로 출력을 진행
 * {@link https://real-report.com/docs/api/ReportViewer#print}
 */
function print() {
    if (!viewer) return;

    viewer.print();
}

/**
 * 양식을 PDF로 내보내기
 * {@link https://real-report.com/docs/api/ReportViewer#exportpdf}
 */
async function exportPdf() {
    if (!viewer) return;

    const [pretendardRegular, pretendardBold] = await Promise.all([
        base64convert('./fonts/Pretendard-Regular.otf'),
        base64convert('./fonts/Pretendard-Bold.otf'),
    ]);

    // PDF에 사용할 폰트를 지정
    const fonts = [
        {
            name: 'regular',
            content: pretendardRegular,
            style: 'normal',
            weight: 'normal',
        },
        {
            name: 'bold',
            content: pretendardBold,
            style: 'normal',
            weight: 'bold',
        },
    ];

    viewer.exportPdf({
        fonts,
        filename: 'sample-report',
        permissions: {},
        pdfVersion: '1.7ext3',
    });
}

/**
 * 양식을 문서로 내보내기
 * @param {*} type 문서의 타입 hwp, docx, pptx
 * @param {*} fileName 내보내기 할 파일명
 * {@link https://real-report.com/docs/api/ReportViewer#exportdocument}
 */
async function exportDocument(type, fileName) {
    if (!viewer) return;

    viewer.exportDocument({ type, fileName });
}

/**
 * 양식을 이미지로 내보내기
 * @param {*} type 이미지 타입 png, jpg, gif, tif
 * @param {*} fileName 내보내기 할 파일명
 * {@link https://real-report.com/docs/api/ReportViewer#exportdocument}
 */
async function exportImage(type, fileName) {
    if (!viewer) return;

    viewer.exportImage({ type, fileName });
}

/**
 * 파일 데이터 base64 string 으로 변경
 * @param {string} url 경로
 * @param {string} split 구분자
 * @returns
 */
async function base64convert(url, split = ',') {
    const data = await fetch(url);
    const blob = await data.blob();

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result;
            resolve(split ? base64data.split(',')[1] : base64data);
        };
    });
}
