import { Timer, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function NoticationOverview() {
  //lista de dados
  const notificacoes = [
    {
      id: 1,
      titulo: "Nova solicitação de pesquisa",
      tipoBadge: "pesquisa",
      textoBadge: "Nova pesquisa",
      tipoTemplate: "criou_pesquisa",
      dados: {
        cargo: "Administrador",
        nome: "Nelson Ferreira",
        destino: "Construtora BV",
      },
      hora: "13h45",
      data: "17/06/2026",
    },
    {
      id: 2,
      titulo: "Nova solicitação de pesquisa",
      tipoBadge: "pesquisa",
      textoBadge: "Nova pesquisa",
      tipoTemplate: "criou_pesquisa",
      dados: {
        cargo: "Gestora",
        nome: "Maiara Moreira",
        destino: "Baymetrics",
      },
      hora: "13h21",
      data: "17/06/2026",
    },
    {
      id: 3,
      titulo: "Solicitação de alteração",
      tipoBadge: "alteracao",
      textoBadge: "Alteração solicitada",
      tipoTemplate: "solicitou_alteracao",
      dados: {
        solicitante: "Construtora BV",
        documento: "Formulário 1",
      },
      hora: "12h39",
      data: "17/06/2026",
    },
  ];

  return (
    <div className="w-full px-16">
      <Card className="w-full border border-neutral-blue bg-white rounded-2xl shadow-box-field p-2">
        <CardHeader className="flex flex-row items-center justify-between pt-6 px-6 space-y-0">
          <CardTitle className="text-xl font-bold text-black font-sans">
            Notificações
          </CardTitle>
          <Button
            variant="link"
            className="text-black font-bold text-sm p-0 h-auto hover:cursor-pointer"
          >
            Ver todas
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 px-6 pb-6 pt-8">
          {notificacoes.map((notif) => (
            <Card
              key={notif.id}
              className="w-full rounded-2xl border-gray-light-placeholder-secondary shadow-box-field"
            >
              <CardContent className="p-5 flex flex-col justify-between gap-4">
                <div className="flex items-start justify-between w-full">
                  <h3 className="text-lg font-semibold text-blue-primary">
                    {notif.titulo}
                  </h3>
                  <span
                    className={`rounded-full px-4 py-1 text-xs font-semibold tracking-wide border font-sans select-none bg-transparent ${
                      notif.tipoBadge === "alteracao"
                        ? "text-status-change-requested border-status-change-requested"
                        : "text-blue-primary border-blue-primary"
                    }`}
                  >
                    {notif.textoBadge}
                  </span>
                </div>

                <p className="text-sm font-normal text-gray-600 font-sans leading-relaxed">
                  {notif.tipoTemplate === "criou_pesquisa" ? (
                    <>
                      <span className="font-bold text-black">
                        {notif.dados.cargo} {notif.dados.nome}
                      </span>{" "}
                      criou nova pesquisa para{" "}
                      <span className="font-bold text-black">
                        {notif.dados.destino}
                      </span>
                    </>
                  ) : (
                    <>
                      A{" "}
                      <span className="font-bold text-black">
                        {notif.dados.solicitante}
                      </span>{" "}
                      solicitou alteração no{" "}
                      <span className="font-bold text-black">
                        {notif.dados.documento}
                      </span>
                    </>
                  )}
                </p>

                <div className="flex flex-wrap gap-2 items-center mt-1">
                  <div className="flex items-center gap-1.5 px-3 py-1 border-[0.5px] border-gray-placeholder rounded-full text-xs font-medium text-gray-placeholder bg-transparent">
                    <Timer className="w-4 h-4 text-gray-placeholder" />
                    <span>{notif.hora}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 border-[0.5px] border-gray-placeholder rounded-full text-xs font-medium text-gray-placeholder bg-transparent">
                    <Calendar className="w-4 h-4 text-gray-placeholder" />
                    <span>{notif.data}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
