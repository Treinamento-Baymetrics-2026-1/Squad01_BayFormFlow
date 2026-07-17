const FORM_STATUS_VALUES = [
  "Criado",
  "Mudança Solicitada",
  "Mudança Realizada",
  "Em Andamento",
  "Concluido",
  "Cancelado",
];

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "BayFormFlow API",
    description:
      "API das Edge Functions do BayFormFlow (auth, researches, forms). " +
      "Todas as rotas (exceto esta documentação) exigem `Authorization: Bearer <access_token>`.",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://127.0.0.1:54321/functions/v1",
      description: "Local (supabase start)",
    },
  ],
  tags: [
    {
      name: "auth",
      description:
        "Provisionamento e listagem de usuários/empresas (Admin-only)",
    },
    { name: "researches", description: "Pesquisas (Admin-only)" },
    {
      name: "forms",
      description: "Formulários (Admin ou Gestor responsável pela pesquisa)",
    },
  ],
  security: [{ bearerAuth: [] }],
  paths: {
    "/auth/operators": {
      post: {
        tags: ["auth"],
        summary: "Provisiona um operador (Gestor ou Validador)",
        description:
          "Admin-only. Cria o usuário no Auth, em `t_users` e em `t_employees`.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/OperatorInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Operador criado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user_id: { type: "string", format: "uuid" },
                    employee_id: { type: "integer" },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "409": {
            description: "E-mail já cadastrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorBody" },
              },
            },
          },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/auth/companies": {
      post: {
        tags: ["auth"],
        summary: "Provisiona uma empresa",
        description:
          "Admin-only. Cria o usuário no Auth, em `t_users` e em `t_companies`.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CompanyInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Empresa criada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user_id: { type: "string", format: "uuid" },
                    company_id: { type: "integer" },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "409": {
            description: "E-mail já cadastrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorBody" },
              },
            },
          },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      get: {
        tags: ["auth"],
        summary: "Lista empresas",
        description: "Admin-only.",
        responses: {
          "200": {
            description: "Lista de empresas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    companies: {
                      type: "array",
                      items: { $ref: "#/components/schemas/CompanyListItem" },
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/auth/users": {
      get: {
        tags: ["auth"],
        summary: "Lista usuários",
        description:
          "Admin-only. Inclui o papel (employee/company) de cada usuário, quando existir.",
        responses: {
          "200": {
            description: "Lista de usuários",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    users: {
                      type: "array",
                      items: { $ref: "#/components/schemas/UserListItem" },
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/researches": {
      post: {
        tags: ["researches"],
        summary: "Cria uma pesquisa",
        description:
          "Admin-only. `manager_id` deve ser um funcionário com `position = 'Gestor'` e cada " +
          "`validator_ids` deve ser um funcionário com `position = 'Validador'`.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateResearchInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Pesquisa criada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { research_id: { type: "integer" } },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/forms": {
      post: {
        tags: ["forms"],
        summary: "Cria um formulário",
        description:
          "Admin ou Gestor responsável pela pesquisa (`research_id`). Cria `t_forms` e a 1ª versão " +
          "em `t_form_versions`.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateFormInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Formulário criado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    form_id: { type: "string", format: "uuid" },
                    form_version_id: { type: "string" },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      get: {
        tags: ["forms"],
        summary: "Pesquisa formulários",
        description: "Admin-only.",
        parameters: [
          {
            name: "research_id",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1 },
          },
          {
            name: "form_status",
            in: "query",
            required: false,
            schema: { type: "string", enum: FORM_STATUS_VALUES },
          },
        ],
        responses: {
          "200": {
            description: "Lista de formulários",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    forms: {
                      type: "array",
                      items: { $ref: "#/components/schemas/FormListItem" },
                    },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "Supabase access_token",
      },
    },
    responses: {
      Unauthorized: {
        description: "Sem header Authorization Bearer",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorBody" },
          },
        },
      },
      Forbidden: {
        description: "Autenticado, mas sem permissão para a operação",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorBody" },
          },
        },
      },
      BadRequest: {
        description: "Validação de entrada falhou ou referência inexistente",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorBody" },
          },
        },
      },
      InternalError: {
        description: "Falha inesperada",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorBody" },
          },
        },
      },
    },
    schemas: {
      ErrorBody: {
        type: "object",
        properties: {
          error: { type: "string" },
          detail: { type: "string" },
        },
        required: ["error"],
      },
      TimePeriod: {
        type: "object",
        properties: {
          start: { type: "string", format: "date-time" },
          end: { type: "string", format: "date-time" },
        },
        required: ["start", "end"],
      },
      OperatorInput: {
        type: "object",
        properties: {
          display_name: { type: "string", minLength: 1 },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8 },
          position: { type: "string", enum: ["Gestor", "Validador"] },
          is_admin: {
            type: "boolean",
            default: false,
            description: "Só pode ser `true` quando `position = 'Gestor'`.",
          },
        },
        required: ["display_name", "email", "password", "position"],
      },
      CompanyInput: {
        type: "object",
        properties: {
          display_name: { type: "string", minLength: 1 },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8 },
          cnpj: {
            type: "string",
            pattern: "^[0-9A-Z]{12}[0-9]{2}$",
            description:
              "CNPJ alfanumérico (12 caracteres alfanuméricos + 2 dígitos verificadores).",
          },
          phonenumber: { type: "string", pattern: "^[0-9]{7,15}$" },
        },
        required: ["display_name", "email", "password", "cnpj", "phonenumber"],
      },
      UserListItem: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          display_name: { type: "string" },
          is_deleted: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          role: {
            nullable: true,
            oneOf: [
              {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["employee"] },
                  position: { type: "string", enum: ["Gestor", "Validador"] },
                  is_admin: { type: "boolean" },
                },
              },
              {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["company"] },
                  cnpj: { type: "string" },
                  phonenumber: { type: "string" },
                },
              },
            ],
          },
        },
      },
      CompanyListItem: {
        type: "object",
        properties: {
          id: { type: "integer" },
          user_id: { type: "string", format: "uuid" },
          cnpj: { type: "string" },
          phonenumber: { type: "string" },
          display_name: { type: "string", nullable: true },
          is_deleted: { type: "boolean", nullable: true },
          created_at: { type: "string", format: "date-time", nullable: true },
        },
      },
      CreateResearchInput: {
        type: "object",
        properties: {
          company_id: { type: "integer", minimum: 1 },
          display_name: { type: "string", minLength: 1, maxLength: 120 },
          research_description: { type: "string", maxLength: 2000 },
          research_period: { $ref: "#/components/schemas/TimePeriod" },
          manager_id: {
            type: "integer",
            minimum: 1,
            description: "Deve ser um funcionário com position = 'Gestor'.",
          },
          validator_ids: {
            type: "array",
            items: { type: "integer", minimum: 1 },
            minItems: 1,
            description:
              "Ids de funcionários com position = 'Validador'. Sem duplicatas e sem sobrepor manager_id.",
          },
        },
        required: [
          "company_id",
          "display_name",
          "research_period",
          "manager_id",
          "validator_ids",
        ],
      },
      CreateFormInput: {
        type: "object",
        properties: {
          research_id: { type: "integer", minimum: 1 },
          display_name: { type: "string", minLength: 1, maxLength: 120 },
          forms_description: { type: "string", minLength: 1, maxLength: 2000 },
          time_period: { $ref: "#/components/schemas/TimePeriod" },
          participant_target: { type: "integer", minimum: 1 },
          form: {
            type: "object",
            additionalProperties: true,
            description: "Definição livre do formulário (JSON).",
          },
          version_name: {
            type: "string",
            minLength: 1,
            maxLength: 10,
            default: "v1",
          },
        },
        required: [
          "research_id",
          "display_name",
          "forms_description",
          "time_period",
          "participant_target",
          "form",
        ],
      },
      FormListItem: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          display_name: { type: "string" },
          forms_description: { type: "string" },
          time_period: { $ref: "#/components/schemas/TimePeriod" },
          form_status: { type: "string", enum: FORM_STATUS_VALUES },
          participant_target: { type: "integer" },
          published_at: { type: "string", format: "date-time", nullable: true },
          created_at: { type: "string", format: "date-time" },
          research_id: { type: "integer" },
        },
      },
    },
  },
} as const;
