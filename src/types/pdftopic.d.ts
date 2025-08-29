declare module 'pdftopic' {
  function pdftobuffer(pdfBuffer: Buffer, pages: string | number): Promise<Buffer[] | null>
  
  export { pdftobuffer }
  export default { pdftobuffer }
}
