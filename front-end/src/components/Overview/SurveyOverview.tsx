import { Card, CardContent } from "@/components/ui/card";

export const SurveyOverview = () => {
  // dados salvos
  const dadosDashboard = [
    { title: "Pesquisas ativas", value: 100 },
    { title: "Pesquisas em andamento", value: 50 },
    { title: "Pesquisas para revisão", value: 10 },
    { title: "Usuários ativos", value: 67 },
    { title: "Empresas ativas", value: 20 },
  ];
  return (
    <div className="w-full px-16 mt-17.5">
      <div className="flex justify-between items-center w-full">
        <h3 className="font-bold text-2xl text-blue-primary">Visão geral</h3>
      </div>
      <div>
        <p className="font-normal text-base leading-6 tracking-normal text-gray-placeholder">
          Acompanhe o andamento das suas pesquisas
        </p>
      </div>
      <div className="flex flex-wrap gap-4 mt-9 w-full justify-start">
        {dadosDashboard.map((item, index) => (
          <Card
            key={index}
            className="min-w-69.5 h-35 flex-1 rounded-2xl border border-blue-primary shadow-card-survey"
          >
            <CardContent className="p-6 flex flex-col justify-between gap-6 h-full">
              <p className="text-sm font-normal text-black leading-tight whitespace-nowrap">
                {item.title}
              </p>
              <h2 className="text-4xl font-bold text-blue-primary font-sans tracking-tight">
                {item.value}
              </h2>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
