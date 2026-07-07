import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  TriangleAlert,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schema/loginSchema";
import { useMutation } from "@tanstack/react-query";
import { loginEdgeFunction } from "@/api/auth";
import { supabase } from "@/api/supabase";
import { useNavigate } from "react-router-dom";

export const ModalLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();

  //verificar se o usuário já logado
  useEffect(() => {
    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/visao-geral");
      }
    };

    checkUserSession();
  }, [navigate]);

  // controlando o estado do fluxo
  const { mutate, isPending } = useMutation({
    mutationFn: loginEdgeFunction,
    onSuccess: (data) => {
      if (data.access_token) {
        supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token || "",
        });
      }
      setLoginSuccess(true); // Ativa a mensagem de sucesso

      // Aguarda 1.5 segundos para o usuário ver a mensagem antes de ir para a dashboard
      setTimeout(() => {
        navigate("/visao-geral");
      }, 1500);
      
    },
    onError: (error) => {
      console.error(error);
      setLoginError(true);
    },
  });

  const handleLogin = (formData: any) => {
    setLoginError(false);
    setLoginSuccess(false);
    mutate({ email: formData.email, password: formData.password });
  };

  return (
    <div className="w-full max-w-112.5 mx-auto box-border">
      <div className="rounded-2xl border border-input-border bg-white shadow-box-field font-sans">
        <div className="flex flex-col pt-10 pb-6">
          <h3 className="font-semibold text-center tracking-tight text-4xl text-blue-primary">
            Login
          </h3>
        </div>

        <div className="p-6 pt-0">
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="flex flex-col gap-5"
          >
            {/* Campo: Email */}
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
                disabled={isPending}
              />
              {errors.email && (
                <span className="text-xs text-feedback-error font-medium flex items-center gap-1 mb-6">
                  <TriangleAlert size={14} />
                  {errors.email.message as string}
                </span>
              )}
            </div>

            {/* Campo: Senha */}
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
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-3 flex items-center transition-colors ${
                    errors.password
                      ? "text-feedback-error"
                      : "text-input-border"
                  }`}
                  disabled={isPending}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-feedback-error font-medium flex items-center gap-1 mb-6">
                  <TriangleAlert size={14} />
                  {errors.password.message as string}
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

            {/* Alerta de erro */}
            {loginError && (
              <div className="flex items-center gap-2 p-3 rounded-lg border border-feedback-error bg-feedback-error-light text-feedback-error text-sm font-medium">
                <AlertCircle size={16} className="shrink-0" />
                <span>E-mail ou senha incorretos. Tente novamente.</span>
              </div>
            )}

            {/* Alerta de sucesso */}
            {loginSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-lg border border-feedback-success bg-feedback-success-light text-black text-sm font-medium">
                <CheckCircle2 size={16} className="shrink-0 text-feedback-success" />
                <span>Login realizado com sucesso!</span>
              </div>
            )}

            {/* Botão */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-9 bg-blue-primary text-white font-medium rounded-lg mt-2 shadow-box-field flex items-center justify-center gap-1 cursor-pointer"
            >
              {isPending ? (
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