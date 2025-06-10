interface Props {
  isOpen: boolean;
  demanda: any;
  onClose: () => void;
}

export default function ModalDemandaAprobadas({ isOpen, demanda, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative"
        onClick={e => e.stopPropagation()} // evitar cerrar modal al click dentro
      >
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Detalle Demanda Aprobada</h2>

        <div className="space-y-3 text-gray-700 text-base">
          <p><span className="font-semibold">ID:</span> {demanda.id}</p>
          <p><span className="font-semibold">Descripción:</span> {demanda.detalle}</p>
          <p><span className="font-semibold">Fecha Inicio:</span> {demanda.fecha_inicio}</p>
          <p><span className="font-semibold">Fecha Vencimiento:</span> {demanda.fecha_vencimiento}</p>
          <p><span className="font-semibold">Estado:</span> {demanda.estado}</p>
          <p><span className="font-semibold">Email Contacto:</span> {demanda.email_contacto}</p>
          <p><span className="font-semibold">Responsable Solicitud:</span> {demanda.responsable_solicitud}</p>
          <p><span className="font-semibold">Empresa:</span> {demanda.empresa}</p>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            Cerrar
          </button>
          {/* Si necesitas botones extras, aquí los puedes poner */}
        </div>
      </div>
    </div>
  );
}
