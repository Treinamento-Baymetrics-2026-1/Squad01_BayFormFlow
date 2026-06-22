import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  TriangleAlert,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schema/loginSchema";

export const ModalLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (_data: any) => {
    setLoginError(false);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // teste de erro login (substituir)
    setLoginError(true);
  };

  return (
    <div className="w-full max-w-112.5 mx-auto box-border">
      <div className="rounded-2xl border border-input-border bg-white shadow-box-field font-sans">
        {/* Nome */}
        <div className="flex flex-col pt-10 pb-6">
          <h3 className="font-semibold text-center tracking-tight text-4xl text-blue-primary">
            Login
          </h3>
        </div>

        {/* formulário */}
        <div className="p-6 pt-0">
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="flex flex-col gap-5"
          >
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-medium text-sm">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                className={`w-full h-9 py-2 px-4 border rounded-lg placeholder-gray-placeholder ${
                  errors.email
                    ? "border-feedback-error focus-visible:ring-feedback-error"
                    : "border-input-border"
                }`}
                placeholder="Digite seu e-mail"
                {...register("email")}
                disabled={isSubmitting}
              />

              {errors.email && (
                <span className="text-xs text-feedback-error font-medium flex items-center gap-1 mb-6">
                  <TriangleAlert size={14} />
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* senha */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="font-medium text-sm">
                Senha
              </label>
              <div className="relative w-full">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full h-9 py-2 px-4 border rounded-lg placeholder-gray-placeholder ${
                    errors.password
                      ? "border-feedback-error focus-visible:ring-feedback-error"
                      : "border-input-border"
                  }`}
                  placeholder="Digite sua senha"
                  {...register("password")}
                  disabled={isSubmitting}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-3 flex items-center transition-colors ${
                    errors.password
                      ? "text-feedback-error"
                      : "text-input-border"
                  }`}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <span className="text-xs text-feedback-error font-medium flex items-center gap-1 mb-6">
                  <TriangleAlert size={14} />
                  {errors.password.message}
                </span>
              )}

              <div className="text-right mt-3">
                <a
                  href="#"
                  className="font-semibold text-sm leading-none text-right text-blue-primary"
                >
                  Esqueceu sua senha?
                </a>
              </div>
            </div>

            {/* mensagem erro senha e email */}
            {loginError && (
              <div className="flex items-center gap-2 p-3 rounded-lg border border-feedback-error bg-red-50 text-feedback-error text-sm font-medium">
                <AlertCircle size={16} className="shrink-0" />
                <span>E-mail ou senha incorretos. Tente novamente.</span>
              </div>
            )}

            {/* botão de entrar */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-9 bg-blue-primary text-white font-medium rounded-lg mt-2 shadow-box-field flex items-center justify-center gap-1 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
