export default function PublicFooter() {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_8px_rgba(0,0,0,0.03)] mt-auto border-t border-outline-variant/20">
      <div className="max-w-7xl mx-auto px-gutter-sm lg:px-gutter py-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md font-body-sm text-body-sm text-on-surface-variant">
        <div className="flex items-center gap-space-md">
          <span className="font-label-md text-label-md text-on-surface font-bold">
            SBMS Customer Portal
          </span>
          <span>© 2026 SBMS Incotrade. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-space-lg flex-wrap justify-center">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[16px] text-primary">call</span>
            <span>
              Hỗ trợ kỹ thuật:{' '}
              <a href="tel:19001234" className="font-label-md text-label-md text-primary hover:underline">
                1900 1234
              </a>
            </span>
          </div>
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[16px] text-tertiary">chat</span>
            <span>
              Tư vấn trực tuyến:{' '}
              <a href="#" className="font-label-md text-label-md text-tertiary hover:underline">
                Zalo Support SBMS
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
