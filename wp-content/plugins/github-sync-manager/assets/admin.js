/**
 * GitHub Sync Manager - Admin Scripts
 * 
 * @package GitHub_Sync_Manager
 * @version 3.0.0
 */

jQuery(document).ready(function($) {
    
    // ====================================
    // Test Connection
    // ====================================
    $('#ghsync-test-btn').click(function() {
        var btn = $(this);
        var result = $('#test-result');
        
        btn.prop('disabled', true).text('⏳ جاري الاختبار...');
        result.html('<p style="color: #666;">جاري الاتصال بـ GitHub...</p>');
        
        $.post(ghsyncAjax.ajaxurl, {
            action: 'ghsync_test_connection',
            nonce: ghsyncAjax.nonce,
            token: $('#token').val(),
            repo: $('#repo').val(),
            branch: $('#branch').val()
        }, function(response) {
            if (response.success) {
                result.html('<div class="notice notice-success inline"><p>' + response.data.message + '</p></div>');
            } else {
                result.html('<div class="notice notice-error inline"><p>' + response.data + '</p></div>');
            }
            btn.prop('disabled', false).text('🧪 اختبار الاتصال');
        }).fail(function() {
            result.html('<div class="notice notice-error inline"><p>❌ فشل الاتصال بالسيرفر</p></div>');
            btn.prop('disabled', false).text('🧪 اختبار الاتصال');
        });
    });
    
    // ====================================
    // Manual Sync with Queue Progress
    // ====================================
    $('#ghsync-sync-btn').click(function() {
        if (!confirm('بدء المزامنة الآن؟\n\n⚠️ v3.0 Features:\n- Queue System (10 ملفات/دفعة)\n- File Hash (رفع المتغيّر فقط)\n- Auto Retry (3 محاولات)\n- CDN Caching (24 ساعة)\n\n⏱️ قد يستغرق 1-5 دقائق\n❌ لا تغلق الصفحة')) {
            return;
        }
        
        var btn = $(this);
        var console = $('#sync-console');
        var progressBar = $('#progress-bar');
        var progressText = $('#progress-text');
        
        btn.prop('disabled', true).text('⏳ جاري المزامنة...');
        console.html('').show();
        progressBar.show();
        
        var seconds = 0;
        var phase = 0;
        
        var phases = [
            '🔍 فحص الملفات (Queue System)...',
            '📦 رفع Theme (Batch 1/N)...',
            '🔌 رفع Plugins (Batch N/N)...',
            '⚙️ رفع wp-includes...',
            '✅ إنهاء المزامنة...'
        ];
        
        function addLog(msg, type) {
            type = type || 'info';
            var color = type === 'error' ? '#d63638' : type === 'success' ? '#00a32a' : type === 'warning' ? '#f0b429' : '#2271b1';
            var timestamp = new Date().toLocaleTimeString('ar-DZ');
            console.append('<div style="color: ' + color + '; font-size: 12px; margin: 3px 0; font-family: monospace;">[' + timestamp + '] ' + msg + '</div>');
            console.scrollTop(console[0].scrollHeight);
        }
        
        addLog('🚀 بدء المزامنة v3.0...', 'info');
        addLog('📡 الاتصال بـ GitHub API...', 'info');
        addLog('⚙️ إعداد Queue System...', 'info');
        addLog('🔐 تشفير Token...', 'info');
        addLog('', 'info');
        addLog('✨ التحسينات الجديدة:', 'success');
        addLog('  • Queue: 10 ملفات/دفعة (منع Timeout)', 'success');
        addLog('  • Hash: رفع المتغيّر فقط', 'success');
        addLog('  • Retry: 3 محاولات تلقائية', 'success');
        addLog('  • Cache: روابط CDN مخزنة 24 ساعة', 'success');
        addLog('', 'info');
        addLog('⏳ يرجى الانتظار...', 'warning');
        
        var timer = setInterval(function() {
            seconds++;
            var minutes = Math.floor(seconds / 60);
            var secs = seconds % 60;
            var timeStr = (minutes > 0 ? minutes + 'دق ' : '') + secs + 'ث';
            
            progressText.text('⏱️ الوقت المنقضي: ' + timeStr);
            
            var newPhase = Math.min(Math.floor(seconds / 20), phases.length - 1);
            if (newPhase !== phase) {
                phase = newPhase;
                addLog(phases[phase], 'info');
            }
            
            if (seconds === 60) {
                addLog('ℹ️ Queue System يعمل - معالجة الدفعات...', 'warning');
            }
            if (seconds === 120) {
                addLog('⚠️ قد يكون لديك الكثير من الملفات - الرفع مستمر...', 'warning');
            }
            if (seconds === 180) {
                addLog('⏳ نقترب من النهاية - لا تغلق الصفحة', 'warning');
            }
        }, 1000);
        
        $.ajax({
            url: ghsyncAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'ghsync_manual_sync',
                nonce: ghsyncAjax.nonce
            },
            timeout: 600000,
            success: function(response) {
                clearInterval(timer);
                
                if (response.success) {
                    var data = response.data;
                    
                    addLog('', 'info');
                    addLog('═══════════════════════════════════', 'success');
                    addLog('✅ المزامنة اكتملت بنجاح! (v3.0)', 'success');
                    addLog('═══════════════════════════════════', 'success');
                    addLog('', 'info');
                    addLog('📊 النتائج:', 'info');
                    addLog('  • ملفات مرفوعة: ' + data.total_uploaded, 'success');
                    addLog('  • صور تم تخطيها: ' + data.images_skipped, 'info');
                    addLog('  • ملفات فشلت: ' + data.total_failed, data.total_failed > 0 ? 'error' : 'info');
                    addLog('  • الوقت الفعلي: ' + data.duration + ' ثانية', 'info');
                    addLog('', 'info');
                    addLog('🌐 CDN: jsDelivr (Cached 24h)', 'success');
                    addLog('⚡ Queue: 10 ملفات/دفعة', 'success');
                    addLog('🔐 Token: مشفّر', 'success');
                    addLog('', 'info');
                    
                    if (data.details && data.details.length > 0) {
                        addLog('📝 التفاصيل:', 'info');
                        data.details.forEach(function(detail) {
                            addLog('  ' + detail, 'info');
                        });
                        addLog('', 'info');
                    }
                    
                    addLog('🎉 تم! CDN Cache محدّث', 'success');
                    addLog('🔄 سيتم تحديث الصفحة خلال 3 ثواني...', 'info');
                    
                    progressBar.hide();
                    
                    setTimeout(function() {
                        location.reload();
                    }, 3000);
                } else {
                    addLog('', 'info');
                    addLog('❌ فشلت المزامنة!', 'error');
                    addLog('💬 الخطأ: ' + response.data, 'error');
                    addLog('', 'info');
                    addLog('🔧 الحلول المحتملة:', 'warning');
                    addLog('  1. تحقق من Token و Repository', 'warning');
                    addLog('  2. تأكد من صلاحيات الكتابة', 'warning');
                    addLog('  3. تحقق من اتصال الإنترنت', 'warning');
                    progressBar.hide();
                }
                btn.prop('disabled', false).text('🔄 مزامنة الآن');
            },
            error: function(xhr, status, error) {
                clearInterval(timer);
                
                addLog('', 'info');
                addLog('❌ خطأ في الاتصال!', 'error');
                addLog('💬 التفاصيل: ' + error, 'error');
                addLog('⚠️ الحالة: ' + status, 'error');
                addLog('', 'info');
                
                if (status === 'timeout') {
                    addLog('⏱️ انتهت المهلة الزمنية (Timeout)', 'error');
                    addLog('💡 الحل: قد تكون العملية لا تزال تعمل', 'warning');
                    addLog('   تحقق من GitHub بعد دقيقتين', 'warning');
                } else {
                    addLog('🔧 الحلول:', 'warning');
                    addLog('  1. أعد تحميل الصفحة وحاول مرة أخرى', 'warning');
                    addLog('  2. تحقق من سرعة السيرفر', 'warning');
                    addLog('  3. قلل عدد الملفات', 'warning');
                }
                
                progressBar.hide();
                btn.prop('disabled', false).text('🔄 مزامنة الآن');
            }
        });
    });
});
