const HostPlaceholderPage = ({ title }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-violet-600">Host</p>
    <h2 className="m-0 text-2xl font-bold text-slate-900">{title}</h2>
    <p className="mt-2 text-sm text-slate-500">
      Trang này đang được hoàn thiện. Bạn có thể quay lại mục Quiz của tôi để tiếp tục quản lý bộ câu hỏi.
    </p>
  </div>
);

export default HostPlaceholderPage;
