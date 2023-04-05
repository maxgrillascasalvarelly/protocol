import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { TZippoRouter, TZippoRouteTag } from 'zippo-interface';
import { randomUUID } from 'crypto';

const zippo = createTRPCProxyClient<TZippoRouter>({
    links: [httpBatchLink({ url: 'http://localhost:2022' })],
});

async function main() {
    const randomId = randomUUID();
    const newUser = await zippo.user.create.mutate({
        firstName: 'Mike',
        lastName: `M ${randomId}`,
        email: `mike+${randomId}@example.com`,
        password: 'zfv2ymw3ydv.PND0mpe',
    });
    console.log('Created user: ', newUser);

    // const app = await zippo.app.create.mutate({
    //     integratorTeamId: newUser.integratorTeamId,
    //     name: `App 1`,
    // });
    // console.log('Created app: ', app);
    // if (!app) {
    //     console.log('Failed to create app');
    //     return;
    // }

    // const msg1 = await zippo.user.sendPasswordResetEmail.mutate({
    //     userId: newUser.id,
    //     verifyUrl: 'http://127.0.0.1:3000?email=bob@example.com',
    // });
    // console.log('Msg: ', msg1);

    // const provisionedApp = await zippo.app.provisionAccess.mutate({
    //     id: app.id,
    //     routeTags: [TZippoRouteTag.SwapV1Prices],
    //     rateLimits: [{ minute: 3 }],
    // });
    // console.log('Provisioned app: ', provisionedApp);
    // if (!provisionedApp) {
    //     console.log('Failed to provision app');
    //     return;
    // }

    // const deprovisionedApp = await zippo.app.deprovisionAccess.mutate({
    //     id: app.id,
    //     routeTags: [TZippoRouteTag.SwapV1Prices],
    // });
    // console.log('deprovisioned app: ', deprovisionedApp);
    // if (!deprovisionedApp) {
    //     console.log('Failed to deprovision app');
    //     return;
    // }
}

main();