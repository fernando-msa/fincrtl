# Checklist de release (FinCtrl)

Use este checklist antes de promover uma versão para produção.

## 1) Produto
- [ ] Fluxos críticos de despesas e dívidas funcionando (criar/editar/excluir).
- [ ] Página de novidades da versão (`/releases`) atualizada via `CHANGELOG.md`.
- [ ] Estados de erro e vazio revisados nas telas principais.

## 2) Qualidade
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run test`
- [ ] `npm run test:e2e:smoke`
- [ ] `npm run check:release`

## 3) Release
- [ ] Versão em `package.json` refletida no `CHANGELOG.md`.
- [ ] Notas de versão conferidas para linguagem de cliente final.
- [ ] Deploy de preview validado sem regressões visuais críticas.
