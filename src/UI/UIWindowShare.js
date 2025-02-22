import UIWindow from './UIWindow.js'

async function UIWindowShare(items, recipient){
    return new Promise(async (resolve) => {
        let h = '';
        h += `<div style="padding: 30px 40px 20px; border-bottom: 1px solid #ced7e1;">`;
            h += `<div class="qr-code-window-close-btn generic-close-window-button" style="margin: 5px;"> &times; </div>`;

            //------------------------------------------------
            // Icon
            //------------------------------------------------
            
            // 1 item shared
            h += `<div style="display:flex; justify-content: center; margin-bottom: 10px;">`;
                if(items.length === 1)
                    h += `<img src="${items[0].icon}" style="width:70px; height:70px;">`;
                // 2 items shared
                else if(items.length === 2){
                    h += `<img src="${items[0].icon}" style="width:70px; height:70px; z-index: 2;">`;
                    h += `<img src="${items[1].icon}" style="width:70px; height:70px; margin-left:-55px; margin-top: -10px; z-index:1; transform:scale(0.8);">`;
                }
                // 3 items shared
                else if(items.length === 3){
                    h += `<img src="${items[0].icon}" style="width:70px; height:70px; z-index: 3;">`;
                    h += `<img src="${items[1].icon}" style="width:70px; height:70px; margin-left:-55px; margin-top: -10px; z-index:2; transform:scale(0.8);">`;
                    h += `<img src="${items[2].icon}" style="width:70px; height:70px; margin-left:-55px; margin-top: -20px; z-index:1; transform:scale(0.6);">`;
                }
                // 4 items shared
                else if(items.length === 4){
                    h += `<img src="${items[0].icon}" style="width:70px; height:70px; z-index: 4;">`;
                    h += `<img src="${items[1].icon}" style="width:70px; height:70px; margin-left:-55px; margin-top: -15px; z-index:3; transform:scale(0.8);">`;
                    h += `<img src="${items[2].icon}" style="width:70px; height:70px; margin-left:-55px; margin-top: -25px; z-index:2; transform:scale(0.6);">`;
                    h += `<img src="${items[3].icon}" style="width:70px; height:70px; margin-left:-55px; margin-top: -35px; z-index:1; transform:scale(0.4);">`;
                }
                // 5 items shared
                else if(items.length >= 5){
                    h += `<img src="${items[0].icon}" style="width:70px; height:70px; z-index: 5;">`;
                    h += `<img src="${items[1].icon}" style="width:70px; height:70px; margin-left:-60px; margin-top: -15px; z-index:4; transform:scale(0.8);">`;
                    h += `<img src="${items[2].icon}" style="width:70px; height:70px; margin-left:-60px; margin-top: -25px; z-index:3; transform:scale(0.6);">`;
                    h += `<img src="${items[3].icon}" style="width:70px; height:70px; margin-left:-60px; margin-top: -35px; z-index:2; transform:scale(0.4);">`;
                    h += `<img src="${items[4].icon}" style="width:70px; height:70px; margin-left:-60px; margin-top: -45px; z-index:1; transform:scale(0.2);">`;
                }

            h += `</div>`;

            // ------------------------------------------------
            // Name
            // ------------------------------------------------
            h += `<h2 style="font-size: 17px; margin-top:0; text-align:center; margin-bottom: 40px; font-weight: 400; color: #303d49;">`;
                h += `Share <strong>${html_encode(items[0].name)}</strong>`;
                if(items.length > 1)
                    h += ` and ${items.length - 1} other item${items.length > 2 ? 's' : ''}`;
            h += `</h2>`;

            // form
            h += `<form class="window-give-item-access-form">`;
                // Error msg
                h += `<div class="error"></div>`;
                // Username/email
                h += `<div style="overflow: hidden;">`;
                    h += `<label style="font-size: 16px; font-weight: 600;">${i18n('share_with')}</label>`;
                    h += `<div style="display: flex;">`;
                        // Username/email
                        h += `<input placeholder="username" class="access-recipient" value="${html_encode(recipient ?? '')}" style="border-right: none; margin-bottom: 10px; border-top-right-radius: 0; border-bottom-right-radius: 0;" type="text" autocomplete="recipient_email_username" spellcheck="false" autocorrect="off" autocapitalize="off" data-gramm_editor="false"/>`;
                        // Share
                        h += `<button class="give-access-btn button button-primary button-normal" style="border-top-left-radius: 0; border-bottom-left-radius: 0;" ${!recipient ? 'disabled' : ''}>${i18n('share')}</button>`
                    h += `</div>`;                
                h += `</div>`;
            h += `</form>`;

            //recipients
            h += `<p style="font-size: 14px; margin-bottom: 0px; color: #303d49; text-shadow: 1px 1px white;">People with access</p>`;
            h += `<div class="share-recipients">`;
            h += `</div>`;
        h += `</div>`;

        const el_window = await UIWindow({
            title: 'Share With…',
            icon: null,
            uid: null,
            is_dir: false,
            body_content: h,
            has_head: false,
            selectable_body: false,
            draggable_body: true,
            allow_context_menu: false,
            is_resizable: false,
            is_droppable: false,
            init_center: true,
            allow_native_ctxmenu: true,
            allow_user_select: true,
            onAppend: function(this_window){
                $(this_window).find(`.access-recipient`).get(0).focus({preventScroll:true});
            },
            window_class: 'window-give-access',
            width: 550,
            window_css: {
                height: 'initial',
            },
            body_css: {
                width: 'initial',
                height: '100%',
                'background-color': 'rgb(245 247 249)',
                'backdrop-filter': 'blur(3px)',
            }
        })

        let contacts = [];

        puter.kv.get('contacts').then((kv_contacts) => {
            if(kv_contacts){
                try{
                    contacts = JSON.parse(kv_contacts);
                    $(el_window).find('.access-recipient').autocomplete({
                        source: contacts
                    });
                }catch(e){
                    puter.kv.del('contacts');
                }
            }
        })

        // /stat
        let perms = [];
    let printed_users = [];
        for(let i=0; i<items.length; i++){
            puter.fs.stat({ 
                path: items[i].path,
                returnSubdomains: true,
                returnPermissions: true,
            }).then((fsentry) => {
                let recipients = fsentry.shares?.users;
                let perm_list = '';

                //owner
                //check if this user has been printed here before, important for multiple items
                if(!printed_users.includes(fsentry.owner.username)){
                    perm_list += `<div class="item-perm-recipient-card item-prop-perm-entry item-permission-owner" style="margin-bottom:5px; margin-top:5px; background-color: #f2f2f2;">`
                        if(fsentry.owner.username === window.user.username)
                            perm_list += `You (${fsentry.owner.email ?? fsentry.owner.username})`;
                        else
                            perm_list += fsentry.owner.email ?? fsentry.owner.username;
                        perm_list += `<div style="float:right;"><span class="permission-owner-badge">owner</span></div>`;
                    perm_list += `</div>`;
                    // add this user to the list of printed users
                    printed_users.push(fsentry.owner.username);
                }

                if(recipients.length > 0){
                    recipients.forEach((recipient) => {
                        // others with access
                        if(recipients.length > 0){
                            recipients.forEach(perm => {
                                //check if this user has been printed here before, important for multiple items
                                if(!printed_users.includes(perm.user.username)){
                                    perm_list += `<div data-permission="${perm.permission}" class="item-perm-recipient-card item-prop-perm-entry" data-perm-uid="${perm.user.uid}" style="margin-bottom:5px; margin-top:5px;">`
                                        perm_list += `${perm.user.email ?? perm.user.username}`;
                                        perm_list += `<div style="float:right;"><span class="remove-permission-link remove-permission-icon" data-recipient-username="${perm.user.username}" data-permission="${perm.permission}">✕</span></div>`;
                                    perm_list += `</div>`;
                                    // add this user to the list of printed users
                                    printed_users.push(perm.user.username);
                                }
                            });
                        }
                    });
                }
                $(el_window).find('.share-recipients').append(`${perm_list}`);                  
            }).
            catch((err) => {
                // console.error(err);
            })
        }

        $(el_window).find('.give-access-btn').on('click', async function(e){
            e.preventDefault();
            e.stopPropagation();

            $(el_window).find('.error').hide();

            let recipient_email, recipient_username;
            let recipient_id = $(el_window).find('.access-recipient').val();

            // todo do some basic validation client-side
            if(recipient_id === '' || recipient_id === null || recipient_id === undefined)
                return;

            if(is_email(recipient_id))
                recipient_email = recipient_id;
            else
                recipient_username = recipient_id;
            // can't share with self
            if(recipient_username === window.user.username){
                $(el_window).find('.error').html('You can\'t share with yourself');
                $(el_window).find('.error').fadeIn();
                return;
            }
            else if(recipient_email && recipient_email === window.user.email){
                $(el_window).find('.error').html('You can\'t share with yourself');
                $(el_window).find('.error').fadeIn();
                return;
            }

            // disable 'Give Access' button
            $(el_window).find('.give-access-btn').prop('disabled', true);

            let cancelled_due_to_error = false;
            let share_result;
            let access_level = 'write';

            $.ajax({
                url: puter.APIOrigin + "/share",
                type: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + puter.authToken
                },
                data: JSON.stringify({
                    recipients:[
                        recipient_username || recipient_email
                    ],
                    shares: [
                        {
                            $: 'fs-share',
                            path: items[0].path,
                            access: access_level,
                        }
                    ]
                }),
                success: function(response) {
                    // show success message
                    $(el_window).find('.access-recipient-print').html(recipient_id);
                    let perm_id = `fs:${items[0].uid}:${access_level}`;

                    // append recipient to list
                    let perm_list = '';
                    perm_list += `<div data-permission="${perm_id}" class="item-perm-recipient-card item-prop-perm-entry" style="margin-bottom:5px; margin-top:5px;">`
                        perm_list += `${recipient_username}`;
                        perm_list += `<div style="float:right;"><span class="remove-permission-link remove-permission-icon" data-recipient-username="${recipient_username}" data-permission="${perm_id}">✕</span></div>`;
                    perm_list += `</div>`;

                    // reset input
                    $(el_window).find('.error').hide();
                    $(el_window).find('.access-recipient').val('');

                    // disable 'Give Access' button
                    $(el_window).find('.give-access-btn').prop('disabled', true);
                    
                    // append recipient to list
                    $(el_window).find('.share-recipients').append(`${perm_list}`);

                    // add to contacts
                    if(!contacts.includes(recipient_username)){
                        contacts.push(recipient_username);
                        puter.kv.set('contacts', JSON.stringify(contacts));
                    }

                },
                error: function(err) {
                    // at this point 'username_not_found' and 'shared_with_self' are the only 
                    // errors that need to stop the loop
                    if(err.responseJSON.code === "user_does_not_exist" || err.responseJSON.code === 'shared_with_self'){
                        $(el_window).find('.error').html(err.responseJSON.message);
                        $(el_window).find('.error').fadeIn();
                        cancelled_due_to_error = true;
                    }
                    // re-enable share button
                    $(el_window).find('.give-access-btn').prop('disabled', false);

                }
            });

            // finished
            if(!cancelled_due_to_error){
                $(el_window).find(`.access-recipient`).val('');
            }
            // re-enable share button
            $(el_window).find('.give-access-btn').prop('disabled', false);    

            return false;
        })

        $(el_window).find('.access-recipient').on('input keypress keyup keydown paste', function(){
            if($(this).val() === ''){
                $(el_window).find('.give-access-btn').prop('disabled', true);
            }
            else{
                $(el_window).find('.give-access-btn').prop('disabled', false);
            }
        })

    })
}

$(document).on('click', '.remove-permission-link', async function(){
    let recipient_username = $(this).attr('data-recipient-username');
    let permission = $(this).attr('data-permission');

    fetch(puter.APIOrigin + "/auth/revoke-user-user", {
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${puter.authToken}`,
        },
        "body": JSON.stringify({
            permission: permission,
            target_username: recipient_username
        }),
        "method": "POST"
    }).then((response) => {
        $('.item-perm-recipient-card[data-permission="'+permission+'"]').remove();
    }).catch((err) => {
        console.error(err);
    })
})
export default UIWindowShare